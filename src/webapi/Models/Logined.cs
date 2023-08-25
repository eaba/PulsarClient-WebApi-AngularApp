namespace webapi.Models
{
    public sealed record Logined(string ConnectionId, string Name, string Username, DateTime date, IList<string> ConnectionIds);
}
