using System.ComponentModel.DataAnnotations;

namespace ECommerceQuest.API.DTOs.Auth
{
    public class RegisterRequestDTO
    {
        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        [MaxLength(150)]
        public string Password { get; set; } = string.Empty;
    }
}
