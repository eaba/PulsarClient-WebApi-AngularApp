using Microsoft.AspNetCore.SignalR;
using System.Xml.Linq;
using webapi.Models;

namespace webapi;

public class ChatHub : Hub
{
    private readonly IChatRepository _chatRepository;

    public ChatHub(IChatRepository chatRepository) => _chatRepository = chatRepository;

    public override async Task OnConnectedAsync()
    {
        Context.GetHttpContext().Request.Query.TryGetValue("name", out var name);

        var client = new Client(Context.ConnectionId, name);

        _chatRepository.Add(client);

        await Clients.All.SendAsync("Connected", new Connected(client));

        var clients = _chatRepository.GetExcept(Context.ConnectionId);

        await Clients.Client(Context.ConnectionId).SendAsync("Loaded", new Loaded(clients));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var client = _chatRepository.Removed(Context.ConnectionId);

        await Clients.All.SendAsync("Disconnected", new Disconnected(client));

        await base.OnDisconnectedAsync(exception);
    }
    public async Task Send(Send send)
    {
        if (string.IsNullOrWhiteSpace(send.Message)) return;

        var clients = send.All ? Clients.All : Clients.Clients(Context.ConnectionId, send.ConnectionId);

        var source = _chatRepository.Get(Context.ConnectionId);

        var target = _chatRepository.Get(send.ConnectionId);

        await clients.SendAsync("Sent", new Sent(source, target, send.Message, send.Private));
    }
    public async Task Login(Login login)
    {
        var lo = new Logined(Context.ConnectionId, login.Name, login.Username, new DateTime(), new List<string>() { Context.ConnectionId });

        var logined =_chatRepository.Add(lo);

        await Clients.All.SendAsync("Logined", logined);
    }
    public async Task Message(string send)
    {
        await Clients.All.SendAsync("Sent", send);
    }
}
