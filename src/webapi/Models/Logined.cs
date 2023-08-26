namespace webapi.Models
{
    public sealed record Logined(string ConnectionId, Login Login, IList<string> ConnectionIds);
}
