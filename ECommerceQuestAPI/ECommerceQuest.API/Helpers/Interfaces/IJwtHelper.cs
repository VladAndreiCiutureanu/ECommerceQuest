using ECommerceQuest.API.Models;

namespace ECommerceQuest.API.Helpers.Interfaces
{
    public interface IJwtHelper
    {
        string GenerateToken(User user);
    }
}
