using ECommerceQuest.API.Controllers;
using ECommerceQuest.API.DTOs.Products;
using ECommerceQuest.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductService> _mockProductService;
        private readonly ProductsController _productsController;

        public ProductsControllerTests()
        {
            _mockProductService = new Mock<IProductService>();
            _productsController = new ProductsController(_mockProductService.Object);
        }

        [Fact]
        public async Task GetAllProducts_ReturnsOkResult_WithListOfProducts()
        {
            var expectedProducts = new List<ProductResponseDTO>
            {
                new ProductResponseDTO { Id = 1, Name = "Mouse", Price = 50m },
                new ProductResponseDTO { Id = 2, Name = "Keyboard", Price = 100m }
            };

            _mockProductService.Setup(s => s.GetAllProductsAsync())
                .ReturnsAsync(expectedProducts);

            var result = await _productsController.GetAllProducts();

            var okResult = Assert.IsType<OkObjectResult>(result);

            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<ProductResponseDTO>>(okResult.Value);

            Assert.Equal(expectedProducts, returnedProducts);
        }
    }
}
