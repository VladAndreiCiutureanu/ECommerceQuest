using ECommerceQuest.API.Models;

namespace ECommerceQuest.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();

        Task<Product?> GetByIdAsync(int id);
    }
}
