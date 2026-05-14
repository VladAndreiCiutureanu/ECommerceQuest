using ECommerceQuest.API.DTOs.Auth;
using ECommerceQuest.API.Helpers.Interfaces;
using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Implementations;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace ECommerceQuest.API.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IJwtHelper> _mockJwtHelper;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockJwtHelper = new Mock<IJwtHelper>();

            _authService = new AuthService(_mockUserRepository.Object, _mockJwtHelper.Object);
        }

        [Fact]
        public async Task LoginAsync_WhenUserDoesNotExist_ThrowsUnauthorizedAccessException()
        {
            var request = new LoginRequestDTO
            {
                EmailOrUsername = "invaliduser",
                Password = "Password123"
            };

            _mockUserRepository
                .Setup(repo => repo.GetByEmailOrUsernameAsync(request.EmailOrUsername))
                .ReturnsAsync((User?)null);

            var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _authService.LoginAsync(request));

            Assert.Equal("Invalid email/username or password.", exception.Message);
        }

        [Fact]
        public async Task LoginAsync_WhenPasswordIsIncorrect_ThrowsUnauthorizedAccessException()
        {
            var request = new LoginRequestDTO
            {
                EmailOrUsername = "validuser",
                Password = "WrongPassword"
            };

            string correctPasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123");

            var userInDb = new User("test@test.com", correctPasswordHash, "Test User", "validuser");

            _mockUserRepository
                .Setup(repo => repo.GetByEmailOrUsernameAsync(request.EmailOrUsername))
                .ReturnsAsync(userInDb);


            var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
                _authService.LoginAsync(request));

            Assert.Equal("Invalid email/username or password.", exception.Message);
        }

        [Fact]
        public async Task LoginAsync_WithValidCredentials_ReturnsLoginResponse()
        {
            var correctPassword = "CorrectPassword123";
            var request = new LoginRequestDTO
            {
                EmailOrUsername = "validuser",
                Password = correctPassword
            };

            var correctPasswordHash = BCrypt.Net.BCrypt.HashPassword(correctPassword);
            var userInDb = new User("test@test.com", correctPasswordHash, "Test User", "validuser");

            var expectedToken = "simulated.jwt.token";

            _mockUserRepository
                .Setup(repo => repo.GetByEmailOrUsernameAsync(request.EmailOrUsername))
                .ReturnsAsync(userInDb);

            _mockJwtHelper
                .Setup(jwt => jwt.GenerateToken(userInDb))
                .Returns(expectedToken);

            var response = await _authService.LoginAsync(request);

            Assert.NotNull(response);
            Assert.Equal(expectedToken, response.Token);
            Assert.Equal(userInDb.FullName, response.FullName);
        }

        [Fact]
        public async Task RegisterAsync_WhenUserAlreadyExists_ThrowsInvalidOperationException()
        {
            var request = new RegisterRequestDTO
            {
                Email = "test@test.com",
                Username = "testuser",
                Password = "Password123",
                FullName = "Test User"
            };


            _mockUserRepository.
                Setup(repo => repo.ExistsAsync(request.Email, request.Username)).ReturnsAsync(true);

            var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
                _authService.RegisterAsync(request));


            Assert.Equal("User with the same email or username already exists.", exception.Message);
        }

        [Fact]
        public async Task RegisterAsync_WithValidData_AddsUserSuccessfully()
        {
            var request = new RegisterRequestDTO
            {
                Email = "newuser@test.com",
                Username = "newuser",
                Password = "Password123",
                FullName = "New User"
            };


            _mockUserRepository
                .Setup(repo => repo.ExistsAsync(request.Email, request.Username))
                .ReturnsAsync(false);

            _mockUserRepository
                .Setup(repo => repo.AddAsync(It.IsAny<User>()))
                .ReturnsAsync(5);

            await _authService.RegisterAsync(request);

            _mockUserRepository.Verify(repo => repo.AddAsync(It.Is<User>(u => 
                u.Email == request.Email &&
                u.Username == request.Username &&
                u.FullName == request.FullName &&
                u.Id == 5
            )), Times.Once);
        }
    }
}
