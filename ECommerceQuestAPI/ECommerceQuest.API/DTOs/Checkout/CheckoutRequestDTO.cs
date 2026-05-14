using System.ComponentModel.DataAnnotations;

namespace ECommerceQuest.API.DTOs.Checkout
{
    public class CheckoutRequestDTO
    {
        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "Cart cannot be empty.")]
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
    }
}
