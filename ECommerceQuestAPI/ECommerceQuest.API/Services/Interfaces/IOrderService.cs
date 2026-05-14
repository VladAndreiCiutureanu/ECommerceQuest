using ECommerceQuest.API.DTOs.Checkout;

namespace ECommerceQuest.API.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDTO> CheckoutAsync(CheckoutRequestDTO request, int userId);
    }
}
