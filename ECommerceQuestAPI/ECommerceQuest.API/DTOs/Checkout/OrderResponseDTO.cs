namespace ECommerceQuest.API.DTOs.Checkout
{
    public class OrderResponseDTO
    {
        public int OrderId { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime OrderDate { get; set; }
    }
}
