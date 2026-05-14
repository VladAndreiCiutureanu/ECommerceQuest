using ECommerceQuest.API.DTOs.Products;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Interfaces;

namespace ECommerceQuest.API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository productRepository;

        public ProductService(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductResponseDTO>> GetAllProductsAsync()
        {
            var products = await productRepository.GetAllProductsAsync();

            return products.Select(p => new ProductResponseDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl
            });
        }
    }
}
