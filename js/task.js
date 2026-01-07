// Crear elemento de tarea
function createTaskElement(task, index) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4";

  // Determinar clase de color según prioridad
  let priorityClass = "";
  switch (task.priority) {
    case "High":
      priorityClass = "border-danger";
      break;
    case "Medium":
      priorityClass = "border-warning";
      break;
    case "Low":
      priorityClass = "border-success";
      break;
  }

  // Determinar clase según estado
  let statusBadge = "";
  switch (task.status) {
    case "completed":
      statusBadge = "badge bg-success";
      break;
    case "in-progress":
      statusBadge = "badge bg-warning";
      break;
    default:
      statusBadge = "badge bg-secondary";
  }

  col.innerHTML = `
        <div class="card h-100 ${priorityClass}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title">${escapeHTML(task.title)}</h5>
                    <span class="${statusBadge}">${
    task.status === "completed"
      ? "Completed"
      : task.status === "in-progress"
      ? "In Progress"
      : "Pending"
  }</span>
                </div>
                <p class="card-text">${escapeHTML(task.description)}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">Priority: ${task.priority}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary change-status" data-index="${index}">
                            Change Status
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-task" data-index="${index}">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  return col;
}

//XSS
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
