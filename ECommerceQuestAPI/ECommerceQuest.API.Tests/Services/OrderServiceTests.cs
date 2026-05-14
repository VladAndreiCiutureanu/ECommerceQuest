using ECommerceQuest.API.DTOs.Checkout;
using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Implementations;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;

        private readonly Mock<IProductRepository> _mockProductRepository;

        private readonly OrderService _orderService;

        public OrderServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockProductRepository = new Mock<IProductRepository>();
            _orderService = new OrderService(_mockUnitOfWork.Object, _mockProductRepository.Object);
        }

        [Fact]
        public async Task CheckoutAsync_WhenProductNotFound_ThrowsInvalidOperationException()
        {
            var request = new CheckoutRequestDTO
            {
                ShippingAddress = "123 Main St",
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductId = 1, Quantity = 2 }
                }
            };

            int mockUserId = 1;

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync((Product?)null);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => _orderService.CheckoutAsync(request, mockUserId));

            Assert.Equal("Product with ID 1 not found.", exception.Message);
        }

        [Fact]
        public async Task CheckoutAsync_WhenExceptionOccursDuringTransaction_RollbacksAndThrows()
        {
            var request = new CheckoutRequestDTO
            {
                ShippingAddress = "123 Main St",
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductId = 1, Quantity = 2 }
                }
            };
            int mockUserId = 1;

            var productDb = new Product(1, "Test Product", "Desc", 10.0m, "url");

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(productDb);

            var mockOrderRepository = new Mock<IOrderRepository>();
            _mockUnitOfWork.Setup(u => u.OrderRepository).Returns(mockOrderRepository.Object);

            var simulatedDatabaseException = new Exception("Mock DB Failure");
            mockOrderRepository.Setup(repo => repo.AddOrderAsync(It.IsAny<Order>()))
                .ThrowsAsync(simulatedDatabaseException);

            var exception = await Assert.ThrowsAsync<Exception>(() =>
                _orderService.CheckoutAsync(request, mockUserId));

            Assert.Equal("Mock DB Failure", exception.Message);

            _mockUnitOfWork.Verify(uow => uow.RollbackAsync(), Times.Once);

            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task CheckoutAsync_WithValidRequest_CompletesCheckoutAndReturnsOrderResponse()
        {
            // Arrange
            var request = new CheckoutRequestDTO
            {
                ShippingAddress = "Strada Fericirii 10",
                Items = new List<OrderItemDTO>
                {
                    new OrderItemDTO { ProductId = 1, Quantity = 2 },
                    new OrderItemDTO { ProductId = 2, Quantity = 1 }
                }
            };
            int mockUserId = 5;
            int generatedOrderId = 99;

            var product1 = new Product(1, "Laptop", "Gaming PC", 1000m, "url1");
            var product2 = new Product(2, "Mouse", "Gaming Mouse", 50m, "url2");

            _mockProductRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(product1);
            _mockProductRepository.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(product2);

            var mockOrderRepository = new Mock<IOrderRepository>();
            _mockUnitOfWork.Setup(u => u.OrderRepository).Returns(mockOrderRepository.Object);

            mockOrderRepository
                .Setup(repo => repo.AddOrderAsync(It.IsAny<Order>()))
                .ReturnsAsync(generatedOrderId);

            var response = await _orderService.CheckoutAsync(request, mockUserId);

            Assert.NotNull(response);
            Assert.Equal(generatedOrderId, response.OrderId);
            Assert.Equal(2050m, response.TotalAmount); 

            _mockUnitOfWork.Verify(uow => uow.BeginTransactionAsync(), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.RollbackAsync(), Times.Never);


            mockOrderRepository.Verify(repo => repo.AddOrderItemAsync(It.Is<OrderItem>(i => i.ProductId == 1 && i.Quantity == 2 && i.UnitPrice == 1000m)), Times.Once);
            mockOrderRepository.Verify(repo => repo.AddOrderItemAsync(It.Is<OrderItem>(i => i.ProductId == 2 && i.Quantity == 1 && i.UnitPrice == 50m)), Times.Once);
        }
    }
}
