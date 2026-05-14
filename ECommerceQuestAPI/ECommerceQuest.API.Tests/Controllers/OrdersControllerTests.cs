using ECommerceQuest.API.Controllers;
using ECommerceQuest.API.DTOs.Checkout;
using ECommerceQuest.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Controllers
{
    public class OrdersControllerTests
    {
        private readonly Mock<IOrderService> _mockOrderService;
        private readonly OrdersController _ordersController;

        public OrdersControllerTests()
        {
            _mockOrderService = new Mock<IOrderService>();
            _ordersController = new OrdersController(_mockOrderService.Object);
        }

        private void MockUserInController(int userId)
        {
            var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            _ordersController.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = claimsPrincipal }
            };
        }

        [Fact]
        public async Task Checkout_WithValidRequestAndUser_ReturnsOkResult()
        {
            int mockUserId = 5;
            MockUserInController(mockUserId);

            var request = new CheckoutRequestDTO { ShippingAddress = "Acasa 1" };
            var expectedResponse = new OrderResponseDTO { OrderId = 100, TotalAmount = 50.0m };

            _mockOrderService.Setup(s => s.CheckoutAsync(request, mockUserId))
                .ReturnsAsync(expectedResponse);

            var result = await _ordersController.Checkout(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(expectedResponse, okResult.Value);
        }

        [Fact]
        public async Task Checkout_WhenServiceThrowsInvalidOperationException_ReturnsBadRequest()
        {
            int mockUserId = 5;
            MockUserInController(mockUserId); 

            var request = new CheckoutRequestDTO { ShippingAddress = "Acasa 1" };
            var expectedErrorMessage = "Product with ID 1 not found.";

            _mockOrderService.Setup(s => s.CheckoutAsync(request, mockUserId))
                .ThrowsAsync(new InvalidOperationException(expectedErrorMessage));

            var result = await _ordersController.Checkout(request);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(expectedErrorMessage, badRequestResult.Value);
        }
    }
}
