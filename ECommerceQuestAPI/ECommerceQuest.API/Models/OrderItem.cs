namespace ECommerceQuest.API.Models
{
    public class OrderItem
    {

        public int Id { get; private set; }

        public int OrderId { get; private set; }

        public int ProductId { get; private set; }

        public int Quantity { get; private set; }

        public decimal UnitPrice { get; private set; }

        public OrderItem(int orderId, int productId, int quantity, decimal unitPrice)
        {
            OrderId = orderId;
            ProductId = productId;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }

        public void SetId(int id)
        {
            if (Id != 0)
            {
                throw new InvalidOperationException("Id has already been set and cannot be changed.");
            }
            Id = id;
        }
    }
}
