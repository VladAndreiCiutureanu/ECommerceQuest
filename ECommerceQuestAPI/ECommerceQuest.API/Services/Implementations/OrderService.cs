using ECommerceQuest.API.DTOs.Checkout;
using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using ECommerceQuest.API.Services.Interfaces;

namespace ECommerceQuest.API.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork unitOfWork;

        private readonly IProductRepository productRepository;

        public OrderService(IUnitOfWork unitOfWork, IProductRepository productRepository)
        {
            this.unitOfWork = unitOfWork;
            this.productRepository = productRepository;
        }

        public async Task<OrderResponseDTO> CheckoutAsync(CheckoutRequestDTO request, int userId)
        {
            decimal totalAmount = 0;

            foreach(var item in request.Items)
            {
                var product = await productRepository.GetByIdAsync(item.ProductId);

                if(product == null)
                {
                    throw new InvalidOperationException($"Product with ID {item.ProductId} not found.");
                }

                totalAmount+= product.Price * item.Quantity;
            }

            await unitOfWork.BeginTransactionAsync();

            try
            {
                var order = new Order(userId, totalAmount, request.ShippingAddress);

                int orderId = await unitOfWork.OrderRepository.AddOrderAsync(order);

                order.SetId(orderId);

                foreach(var item in request.Items)
                {
                    var product = await productRepository.GetByIdAsync(item.ProductId);

                    var orderItem = new OrderItem(orderId, item.ProductId, item.Quantity, product!.Price);

                    await unitOfWork.OrderRepository.AddOrderItemAsync(orderItem);
                }

                await unitOfWork.CommitAsync();

                return new OrderResponseDTO
                {
                    OrderId = orderId,
                    TotalAmount = totalAmount,
                    OrderDate = order.OrderDate
                };
            }
            catch
            {
                await unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
