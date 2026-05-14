using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace ECommerceQuest.API.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly string _connectionString;

        public ProductRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            const string query = "SELECT Id, Name, Description, Price, ImageUrl FROM Products";

            var products = new List<Product>();

            using var connection = new SqlConnection(_connectionString);

            using var command = new SqlCommand(query, connection);

            await connection.OpenAsync();
            using var reader = await command.ExecuteReaderAsync();

            while(await reader.ReadAsync())
            {
                products.Add(new Product(
                    reader.GetInt32(reader.GetOrdinal("Id")),
                    reader.GetString(reader.GetOrdinal("Name")),
                    reader.GetString(reader.GetOrdinal("Description")),
                    reader.GetDecimal(reader.GetOrdinal("Price")),
                    reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl"))));
            }

            return products;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            const string query = @"SELECT Id, Name, Description, Price, ImageUrl FROM Products WHERE Id = @Id";

            using var connection = new SqlConnection(_connectionString);

            using var command = new SqlCommand(query, connection);

            command.Parameters.Add("@Id", System.Data.SqlDbType.Int).Value = id;

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if(!await reader.ReadAsync())
            {
                return null;
            }

            return new Product(
                reader.GetInt32(reader.GetOrdinal("Id")),
                reader.GetString(reader.GetOrdinal("Name")),
                reader.GetString(reader.GetOrdinal("Description")),
                reader.GetDecimal(reader.GetOrdinal("Price")),
                reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")));
        }
    }
}
