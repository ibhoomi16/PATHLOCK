import React, { useEffect, useState } from "react";
import "./TaskManager.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const API_URL = "http://localhost:5055/api/tasks";

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Add task
  const addTask = async () => {
    if (!newTaskTitle.trim()) return alert("Please enter a title!");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          description: newTaskDescription.trim(),
          isCompleted: false,
        }),
      });
      if (!response.ok) throw new Error("Failed to add task");
      setNewTaskTitle("");
      setNewTaskDescription("");
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Mark as Completed
  const markAsCompleted = async (task) => {
    try {
      const updated = { ...task, isCompleted: true };
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error("Failed to mark task as completed");
      await fetchTasks();
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  // ✅ Edit Task
  const startEditing = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
  };

  const saveEdit = async () => {
    if (!editingTask) return;
    try {
      const updated = {
        ...editingTask,
        title: newTaskTitle,
        description: newTaskDescription,
      };
      const response = await fetch(`${API_URL}/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!response.ok) throw new Error("Failed to edit task");
      setEditingTask(null);
      setNewTaskTitle("");
      setNewTaskDescription("");
      await fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  // ✅ Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "active") return !task.isCompleted;
    return true;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">
          <i>📋</i> Task Manager
        </div>
        <div className="navbar-right">
          <button
            className={`nav-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`nav-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`nav-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Task Form */}
      <div className="container">
        <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>
        <div className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          {editingTask ? (
            <>
              <button className="save-btn" onClick={saveEdit}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
                ❌ Cancel
              </button>
            </>
          ) : (
            <button className="create-btn" onClick={addTask}>
              CREATE ➤
            </button>
          )}
        </div>

        <h2>Task List ({filter})</h2>
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.isCompleted ? "completed" : ""}`}
              >
                <div className="task-info">
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>

                <div className="task-actions">
                  {!task.isCompleted && (
                    <button
                      className="complete-btn"
                      onClick={() => markAsCompleted(task)}
                    >
                      ✅ Complete
                    </button>
                  )}
                  <button className="edit-btn" onClick={() => startEditing(task)}>
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
