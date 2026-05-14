namespace ECommerceQuest.API.DTOs.Auth
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
    }
}
