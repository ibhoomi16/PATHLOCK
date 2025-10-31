using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskRepository _repository = new();

        // ✅ Get all tasks
        [HttpGet]
        public IActionResult GetAll()
        {
            var tasks = _repository.GetAll();
            return Ok(tasks);
        }

        // ✅ Create a new task
        [HttpPost]
        public IActionResult Create([FromBody] TaskItem task)
        {
            if (task == null || string.IsNullOrWhiteSpace(task.Title))
                return BadRequest("Task title cannot be empty.");

            _repository.Add(task);
            return CreatedAtAction(nameof(GetAll), new { id = task.Id }, task);
        }

        // ✅ Update an existing task (edit title/description)
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] TaskItem updatedTask)
        {
            if (updatedTask == null)
                return BadRequest("Invalid task data.");

            var existingTask = _repository.Get(id);
            if (existingTask == null)
                return NotFound("Task not found.");

            _repository.Update(id, updatedTask);
            return Ok(updatedTask);
        }

        // ✅ Toggle completion status (mark as completed/uncompleted)
        [HttpPatch("{id}/toggle")]
        public IActionResult ToggleStatus(Guid id)
        {
            var task = _repository.Get(id);
            if (task == null)
                return NotFound("Task not found.");

            _repository.ToggleStatus(id);
            return Ok(task);
        }

        // ✅ Delete a task
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var existingTask = _repository.Get(id);
            if (existingTask == null)
                return NotFound("Task not found.");

            _repository.Delete(id);
            return NoContent();
        }
    }
}
