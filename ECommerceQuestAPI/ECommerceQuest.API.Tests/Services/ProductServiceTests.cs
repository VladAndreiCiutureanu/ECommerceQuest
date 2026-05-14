using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Implementations;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _productService = new ProductService(_mockProductRepository.Object);
        }

        [Fact]
        public async Task GetAllProductsAsync_ReturnsMappedProductResponseDTOs()
        {
            var productsInDb = new List<Product>
            {
                new Product(1, "Product 1", "Desc 1", 10.5m, "url1.jpg"),
                new Product(2, "Product 2", "Desc 2", 20.0m, "url2.jpg")
            };

            _mockProductRepository
                .Setup(repo => repo.GetAllProductsAsync())
                .ReturnsAsync(productsInDb);

            var result = await _productService.GetAllProductsAsync();

            Assert.NotNull(result);

            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);

            Assert.Equal(1, resultList[0].Id);
            Assert.Equal("Product 1", resultList[0].Name);
            Assert.Equal("Desc 1", resultList[0].Description);
            Assert.Equal(10.5m, resultList[0].Price);
            Assert.Equal("url1.jpg", resultList[0].ImageUrl);

            Assert.Equal(2, resultList[1].Id);
            Assert.Equal("Product 2", resultList[1].Name);
            Assert.Equal("Desc 2", resultList[1].Description);
            Assert.Equal(20.0m, resultList[1].Price);
            Assert.Equal("url2.jpg", resultList[1].ImageUrl);
        }
    }
}
