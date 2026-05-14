using ECommerceQuest.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace ECommerceQuest.API.Repositories.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SqlConnection _connection;

        private SqlTransaction? _transaction;

        public IOrderRepository OrderRepository { get; }

        public UnitOfWork(IConfiguration configuration, IOrderRepository orderRepository)
        {
            _connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"))?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
            OrderRepository = orderRepository;
            OrderRepository.SetConnection(_connection);
        }

        public async Task BeginTransactionAsync()
        {
            if (_connection.State != System.Data.ConnectionState.Open)
            {
                await _connection.OpenAsync();
            }
            _transaction = (SqlTransaction)await _connection.BeginTransactionAsync();
            OrderRepository.SetTransaction(_transaction);
        }

        public async Task CommitAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _connection?.Dispose();
        }
    }
}
