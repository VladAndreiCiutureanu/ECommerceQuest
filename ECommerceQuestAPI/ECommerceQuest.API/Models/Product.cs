namespace ECommerceQuest.API.Models
{
    public class Product
    {

        public int Id { get; private  set; }

        public string Name { get; private set; } = string.Empty;

        public string Description { get; private set; }

        public decimal Price { get; private set; }

        public string? ImageUrl { get; private set; }

        public Product(int id, string name, string description, decimal price, string? imageUrl)
        {
            Id = id;
            Name = name;
            Description = description;
            Price = price;
            ImageUrl = imageUrl;
        }
    }
}
