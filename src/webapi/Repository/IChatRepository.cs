using webapi.Models;

namespace webapi;

public interface IChatRepository
{
    void Add(Client client);
    Logined Add(Logined client);

    Client Get(string connectionId);

    IEnumerable<Client> Get();

    IEnumerable<Client> GetExcept(string connectionId);

    Client Remove(string connectionId);
    Logined Removed(string connectionId);
}
