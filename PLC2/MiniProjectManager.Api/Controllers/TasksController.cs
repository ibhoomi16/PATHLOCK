using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Api.Data;
using MiniProjectManager.Api.DTOs;
using MiniProjectManager.Api.Models;

namespace MiniProjectManager.Api.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TasksController(AppDbContext db) => _db = db;

        private int GetUserId()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            return int.Parse(id!);
        }

        // POST /api/projects/{projectId}/tasks
        [HttpPost("projects/{projectId:int}/tasks")]
        public async Task<IActionResult> CreateTask(int projectId, [FromBody] TaskCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            var project = await _db.Projects.FindAsync(projectId);
            if (project == null || project.OwnerId != userId) return NotFound(new { message = "Project not found" });

            var task = new ProjectTask { Title = dto.Title, DueDate = dto.DueDate, ProjectId = projectId };
            _db.ProjectTasks.Add(task);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, new { task.Id, task.Title, task.DueDate, task.IsCompleted });
        }

        // GET single task (for CreatedAtAction)
        [HttpGet("tasks/{taskId:int}")]
        public async Task<IActionResult> GetTask(int taskId)
        {
            var userId = GetUserId();
            var task = await _db.ProjectTasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.OwnerId == userId);
            if (task == null) return NotFound();
            return Ok(new { task.Id, task.Title, task.DueDate, task.IsCompleted, ProjectId = task.ProjectId });
        }

        // PUT /api/tasks/{taskId}
        [HttpPut("tasks/{taskId:int}")]
        public async Task<IActionResult> UpdateTask(int taskId, [FromBody] TaskUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = GetUserId();

            var task = await _db.ProjectTasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.OwnerId == userId);
            if (task == null) return NotFound();

            task.Title = dto.Title;
            task.DueDate = dto.DueDate;
            task.IsCompleted = dto.IsCompleted;

            await _db.SaveChangesAsync();
            return Ok(new { task.Id, task.Title, task.DueDate, task.IsCompleted });
        }

        // DELETE /api/tasks/{taskId}
        [HttpDelete("tasks/{taskId:int}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var userId = GetUserId();
            var task = await _db.ProjectTasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.OwnerId == userId);
            if (task == null) return NotFound();

            _db.ProjectTasks.Remove(task);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // PUT /api/tasks/{taskId}/toggle
        [HttpPut("tasks/{taskId:int}/toggle")]
        public async Task<IActionResult> ToggleTask(int taskId)
        {
            var userId = GetUserId();
            var task = await _db.ProjectTasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.OwnerId == userId);
            if (task == null) return NotFound();

            task.IsCompleted = !task.IsCompleted;
            await _db.SaveChangesAsync();
            return Ok(new { task.Id, task.IsCompleted });
        }
    }
}
