using Microsoft.AspNetCore.Mvc;
using SmartSchedulerAPI.Models;

namespace SmartSchedulerAPI.Controllers
{
    [ApiController]
    [Route("api/v1/projects/{projectId}/schedule")]
    public class ScheduleController : ControllerBase
    {
        [HttpPost]
        public IActionResult GenerateSchedule(string projectId, [FromBody] ScheduleRequest request)
        {
            // Build dependency graph
            var graph = new Dictionary<string, List<string>>();
            var indegree = new Dictionary<string, int>();

            foreach (var task in request.Tasks)
            {
                if (!graph.ContainsKey(task.Title))
                    graph[task.Title] = new List<string>();

                if (!indegree.ContainsKey(task.Title))
                    indegree[task.Title] = 0;

                foreach (var dep in task.Dependencies)
                {
                    if (!graph.ContainsKey(dep))
                        graph[dep] = new List<string>();

                    graph[dep].Add(task.Title);

                    if (!indegree.ContainsKey(task.Title))
                        indegree[task.Title] = 0;

                    indegree[task.Title]++;
                }
            }

            // Topological Sort (Kahn’s Algorithm)
            var queue = new Queue<string>(indegree.Where(x => x.Value == 0).Select(x => x.Key));
            var result = new List<string>();

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                result.Add(current);

                foreach (var neighbor in graph[current])
                {
                    indegree[neighbor]--;
                    if (indegree[neighbor] == 0)
                        queue.Enqueue(neighbor);
                }
            }

            // Handle circular dependency
            if (result.Count != request.Tasks.Count)
                return BadRequest(new { error = "Circular dependency detected." });

            return Ok(new ScheduleResponse { RecommendedOrder = result });
        }
    }
}
