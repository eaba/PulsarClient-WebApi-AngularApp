namespace webapi;

public sealed record Send
{
    public bool All => string.IsNullOrWhiteSpace(ConnectionId) || !Private;

    public required string ConnectionId { get; set; }

    public required string Message { get; set; }

    public bool Private { get; set; }
}
