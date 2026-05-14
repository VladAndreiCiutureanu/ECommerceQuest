using System.ComponentModel.DataAnnotations;

namespace ECommerceQuest.API.DTOs.Auth
{
    public class LoginRequestDTO
    {
        [Required]
        public string EmailOrUsername { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
