using System;

namespace MiniProjectManager.Api.Models
{
    public class ProjectTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; } = false;

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
