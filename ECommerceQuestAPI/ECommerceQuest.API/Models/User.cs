namespace ECommerceQuest.API.Models
{
    public class User
    {

        public int Id { get; private set; }

        public string Email { get; private set; } = string.Empty;

        public string PasswordHash { get; private set; } = string.Empty;

        public string FullName { get; private set; } = string.Empty;

        public string Username { get; private set; } = string.Empty;

        public User(string email, string passwordHash, string fullName, string username)
        {
            Email = email;
            PasswordHash = passwordHash;
            FullName = fullName;
            Username = username;
        }

        public void SetId(int id)
        {
            if(Id != 0)
            {
                throw new InvalidOperationException("Id has already been set and cannot be changed.");
            }

            Id = id;
        }

    }
}
