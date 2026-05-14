using ECommerceQuest.API.DTOs.Products;

namespace ECommerceQuest.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDTO>> GetAllProductsAsync();
    }
}
