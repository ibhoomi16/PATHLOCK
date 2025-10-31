using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public class TaskRepository
    {
        private static readonly List<TaskItem> _tasks = new();

        public IEnumerable<TaskItem> GetAll() => _tasks;
        public TaskItem? Get(Guid id) => _tasks.FirstOrDefault(t => t.Id == id);

        public void Add(TaskItem task) => _tasks.Add(task);

        public void Update(Guid id, TaskItem updatedTask)
        {
            var existing = _tasks.FirstOrDefault(t => t.Id == id);
            if (existing == null) return;

            existing.Title = updatedTask.Title;
            existing.Description = updatedTask.Description;
            existing.IsCompleted = updatedTask.IsCompleted;
        }

        public void ToggleStatus(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                task.IsCompleted = !task.IsCompleted;
            }
        }

        public void Delete(Guid id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task != null) _tasks.Remove(task);
        }
    }
}

