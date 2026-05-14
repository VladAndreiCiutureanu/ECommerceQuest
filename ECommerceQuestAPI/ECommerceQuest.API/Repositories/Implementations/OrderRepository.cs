using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace ECommerceQuest.API.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private SqlConnection? _connection;
        private SqlTransaction? _transaction;

        public OrderRepository()
        {
            
        }

        public void SetConnection(SqlConnection connection)
        {
            _connection = connection;
        }

        public void SetTransaction(SqlTransaction transaction)
        {
            _transaction = transaction;
        }

        public async Task<int> AddOrderAsync(Order order)
        {
            const string query = @"INSERT INTO Orders(UserId, OrderDate, TotalAmount, ShippingAddress) 
                                   OUTPUT INSERTED.Id
                                   VALUES (@UserId, @OrderDate, @TotalAmount, @ShippingAddress);";


            using var command = new SqlCommand(query, _connection, _transaction);

            command.Parameters.Add("@UserId", System.Data.SqlDbType.Int).Value = order.UserId;

            command.Parameters.Add("@OrderDate", System.Data.SqlDbType.DateTime).Value = order.OrderDate;

            command.Parameters.Add("@TotalAmount", System.Data.SqlDbType.Decimal).Value = order.TotalAmount;

            command.Parameters.Add("@ShippingAddress", System.Data.SqlDbType.NVarChar, 500).Value = order.ShippingAddress;

            return Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        public async Task AddOrderItemAsync(OrderItem orderItem)
        {
            const string query = @"INSERT INTO OrderItems(OrderId, ProductId, Quantity, UnitPrice) 
                                   VALUES (@OrderId, @ProductId, @Quantity, @UnitPrice);";

            using var command = new SqlCommand(query, _connection, _transaction);

            command.Parameters.Add("@OrderId", System.Data.SqlDbType.Int).Value = orderItem.OrderId;

            command.Parameters.Add("@ProductId", System.Data.SqlDbType.Int).Value = orderItem.ProductId;

            command.Parameters.Add("@Quantity", System.Data.SqlDbType.Int).Value = orderItem.Quantity;

            command.Parameters.Add("@UnitPrice", System.Data.SqlDbType.Decimal).Value = orderItem.UnitPrice;

            await command.ExecuteNonQueryAsync();
        }
    }
}
