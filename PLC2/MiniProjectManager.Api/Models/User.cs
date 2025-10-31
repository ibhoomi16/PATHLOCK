using System.Collections.Generic;

namespace MiniProjectManager.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
