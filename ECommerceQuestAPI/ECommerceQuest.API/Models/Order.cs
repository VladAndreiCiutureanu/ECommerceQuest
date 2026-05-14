namespace ECommerceQuest.API.Models
{
    public class Order
    {

        public int Id { get; private set; }

        public int UserId { get; private set; }

        public DateTime OrderDate { get; private set; } = DateTime.Now;

        public decimal TotalAmount { get; private set; }

        public string ShippingAddress { get; private set; } = string.Empty;

        public Order(int userId, decimal totalAmount, string shippingAddress)
        {
            UserId = userId;
            OrderDate = DateTime.Now;
            TotalAmount = totalAmount;
            ShippingAddress = shippingAddress;
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
