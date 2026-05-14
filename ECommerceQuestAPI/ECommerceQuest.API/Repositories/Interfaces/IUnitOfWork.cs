namespace ECommerceQuest.API.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IOrderRepository OrderRepository { get; }

        Task BeginTransactionAsync();

        Task CommitAsync();

        Task RollbackAsync();
    }
}
