using webapi.Models;

namespace webapi;

public sealed class ChatRepository : IChatRepository
{
    private readonly IList<Client> _clients = new List<Client>();
    private readonly IList<Logined> _logineds = new List<Logined>();
    public void Add(Client client)
    {
        if (!_clients.Contains(client)) _clients.Add(client);
    }
    public Logined Add(Logined log)
    {
        foreach (var l in _logineds)
        {
            if (l.Login.Username == log.Login.Username)
            {
                l.ConnectionIds.Add(log.ConnectionId);
                return l;
            }
            else
            { 
                _logineds.Add(log);
                return log;
            }
        }
        return null;
    }
    public Client Get(string connectionId) => _clients.SingleOrDefault(client => client.ConnectionId == connectionId);

    public Logined GetUsername(string username) => _logineds.SingleOrDefault(logined => logined.Login.Username == username);
    public Logined GetConnectionId(string connectionId) => _logineds.SingleOrDefault(logined => logined.ConnectionId == connectionId);

    public IEnumerable<Client> Get() => _clients.OrderBy(client => client.Name);

    public IEnumerable<Client> GetExcept(string connectionId) => Get().Where(client => client.ConnectionId != connectionId);

    public Client Remove(string connectionId)
    {
        var client = Get(connectionId);

        _clients.Remove(client);

        return client;
    }
    public Logined Removed(string connectionId)
    {
        var client = GetConnectionId(connectionId);

        return client;
    }
}
