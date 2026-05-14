using ECommerceQuest.API.DTOs.Auth;
using ECommerceQuest.API.Helpers.Interfaces;
using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Interfaces;

namespace ECommerceQuest.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository userRepository;

        private readonly IJwtHelper jwtHelper;

        public AuthService(IUserRepository userRepository, IJwtHelper jwtHelper)
        {
            this.jwtHelper = jwtHelper;
            this.userRepository = userRepository;
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            var user = await userRepository.GetByEmailOrUsernameAsync(request.EmailOrUsername);

            if(user == null)
            {
                throw new UnauthorizedAccessException("Invalid email/username or password.");
            }

            if(!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email/username or password.");
            }

            var token = jwtHelper.GenerateToken(user);

            return new LoginResponseDTO
            {
                Token = token,
                FullName = user.FullName
            };

        }

        public async Task RegisterAsync(RegisterRequestDTO request)
        {
            if(await userRepository.ExistsAsync(request.Email, request.Username))
            {
                throw new InvalidOperationException("User with the same email or username already exists.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User(request.Email, passwordHash, request.FullName, request.Username);

            int generatedId = await userRepository.AddAsync(user);

            user.SetId(generatedId);
        }


    }
}
