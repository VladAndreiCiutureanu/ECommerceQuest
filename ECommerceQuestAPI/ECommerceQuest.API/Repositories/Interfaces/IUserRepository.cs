using ECommerceQuest.API.Models;

namespace ECommerceQuest.API.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailOrUsernameAsync(string emailOrUsername);

        Task<bool> ExistsAsync(string email, string username);

        Task<int> AddAsync(User user);


    }
}
