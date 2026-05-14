using ECommerceQuest.API.Controllers;
using ECommerceQuest.API.DTOs.Auth;
using ECommerceQuest.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _authController;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _authController = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Register_WithValidRequest_ReturnsOkResult()
        {
            var request = new RegisterRequestDTO { Email = "test@test.com", Username = "testuser" };

            _mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterRequestDTO>()))
                .Returns(Task.CompletedTask);

            var result = await _authController.Register(request);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("User registered successfully.", okResult.Value);
        }

        [Fact]
        public async Task Register_WhenServiceThrowsInvalidOperationException_ReturnsUnauthorizedResult()
        {
            var request = new RegisterRequestDTO { Email = "test@test.com" };
            var expectedErrorMessage = "User with the same email or username already exists.";

            _mockAuthService.Setup(s => s.RegisterAsync(It.IsAny<RegisterRequestDTO>()))
                .ThrowsAsync(new InvalidOperationException(expectedErrorMessage));

            var result = await _authController.Register(request);

            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(expectedErrorMessage, unauthorizedResult.Value);
        }

        [Fact]
        public async Task Login_WithValidRequest_ReturnsOkResultWithData()
        {
            var request = new LoginRequestDTO { EmailOrUsername = "user", Password = "pws" };
            var expectedResponse = new LoginResponseDTO { Token = "jwt", FullName = "Name" };

            _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginRequestDTO>()))
                .ReturnsAsync(expectedResponse);

            var result = await _authController.Login(request);

            var okResult = Assert.IsType<OkObjectResult>(result);

            Assert.Equal(expectedResponse, okResult.Value);
        }

        [Fact]
        public async Task Login_WhenServiceThrowsUnauthorizedAccessException_ReturnsUnauthorizedResult()
        {
             var request = new LoginRequestDTO { EmailOrUsername = "user", Password = "pws" };
             var expectedErrorMessage = "Invalid email/username or password.";

             _mockAuthService.Setup(s => s.LoginAsync(It.IsAny<LoginRequestDTO>()))
                .ThrowsAsync(new UnauthorizedAccessException(expectedErrorMessage));

            var result = await _authController.Login(request);

            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(expectedErrorMessage, unauthorizedResult.Value);
        }
    }
}
