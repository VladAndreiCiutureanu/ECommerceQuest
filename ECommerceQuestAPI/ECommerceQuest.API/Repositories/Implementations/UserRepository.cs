using ECommerceQuest.API.Models;
using ECommerceQuest.API.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

namespace ECommerceQuest.API.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<int> AddAsync(User user)
        {
            const string query = @"INSERT INTO Users (Email, PasswordHash, FullName, Username)
                                 OUTPUT INSERTED.Id
                                 VALUES(@Email, @PasswordHash, @FullName, @Username)";

            using var connection = new SqlConnection(_connectionString);

            using var command = new SqlCommand(query, connection);

            command.Parameters.Add("@Email", System.Data.SqlDbType.NVarChar, 150).Value = user.Email;
            
            command.Parameters.Add("@PasswordHash", System.Data.SqlDbType.NVarChar, 256).Value = user.PasswordHash;

            command.Parameters.Add("@FullName", System.Data.SqlDbType.NVarChar, 150).Value = user.FullName;

            command.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar, 100).Value = user.Username;

            await connection.OpenAsync();

            return Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        public async Task<bool> ExistsAsync(string email, string username)
        {
            const string query = @"SELECT COUNT(1) FROM Users 
                                WHERE Email = @Email OR Username = @Username";

            using var connection = new SqlConnection(_connectionString);

            using var command = new SqlCommand(query, connection);

            command.Parameters.Add("@Email",System.Data.SqlDbType.NVarChar, 150).Value = email;

            command.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar, 100).Value = username;

            await connection.OpenAsync();

            return Convert.ToInt32(await command.ExecuteScalarAsync()) > 0;
        }

        public async Task<User?> GetByEmailOrUsernameAsync(string emailOrUsername)
        {
            const string query = @"SELECT Id, Email, PasswordHash, FullName, Username FROM Users
                                 WHERE Email = @EmailOrUsername OR Username = @EmailOrUsername";

            using var connection = new SqlConnection(_connectionString);

            using var command = new SqlCommand(query, connection);

            command.Parameters.Add("@EmailOrUsername", System.Data.SqlDbType.NVarChar, 150).Value = emailOrUsername;

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if(!await reader.ReadAsync())
            {
                return null;
            }

            var user = new User(
                reader.GetString(reader.GetOrdinal("Email")),
                reader.GetString(reader.GetOrdinal("PasswordHash")),
                reader.GetString(reader.GetOrdinal("FullName")),
                reader.GetString(reader.GetOrdinal("Username"))
                );

            user.SetId(reader.GetInt32(reader.GetOrdinal("Id")));

            return user;
        }
    }
}
