using ECommerceQuest.API.Models;
using Microsoft.Data.SqlClient;

namespace ECommerceQuest.API.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<int> AddOrderAsync(Order order);

        Task AddOrderItemAsync(OrderItem orderItem);

        void SetTransaction(SqlTransaction transaction);

        void SetConnection(SqlConnection connection);
    }
}
