using ECommerceQuest.API.DTOs.Auth;

namespace ECommerceQuest.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterRequestDTO request);

        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request);
    }
}
