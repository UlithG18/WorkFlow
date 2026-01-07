// Estado global de las tareas
let tasks = [];
let currentFilter = { status: null, priority: null };

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  // Cargar tareas desde localStorage si existen
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }

  // Delegación de eventos en el contenedor de tareas
  document
    .getElementById("tasks-list")
    .addEventListener("click", handleTaskEvents);

  // Eventos del formulario
  document.getElementById("form").addEventListener("submit", handleFormSubmit);

  // Eventos de los filtros
  document
    .getElementById("filter-status")
    .addEventListener("change", handleFilterChange);
  document
    .getElementById("filter-priority")
    .addEventListener("change", handleFilterChange);
});

// Mostrar tareas dinámicamente
function renderTasks() {
  const tasksList = document.getElementById("tasks-list");
  tasksList.innerHTML = "";

  // Filtrar tareas según los filtros activos
  let filteredTasks = tasks;

  if (currentFilter.status) {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === currentFilter.status
    );
  }

  if (currentFilter.priority) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === currentFilter.priority
    );
  }

  // Crear y agregar cada tarea al DOM
  filteredTasks.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);
    tasksList.appendChild(taskElement);
  });

  // Guardar en localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
                        <button class="btn btn-sm btn-outline-warning edit-status" data-index="${index}">
                            Edit
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

// Delegación de eventos para manejar interacciones con tareas
function handleTaskEvents(event) {
  const target = event.target;
  const taskIndex = target.getAttribute("data-index");

  if (!taskIndex) return;

  if (target.classList.contains("delete-task")) {
    deleteTask(parseInt(taskIndex));
  } else if (target.classList.contains("change-status")) {
    changeTaskStatus(parseInt(taskIndex));
  }
}

// Cambiar estado de la tarea
function changeTaskStatus(index) {
  if (tasks[index]) {
    const statusOrder = ["pending", "in-progress", "completed"];
    const currentStatus = tasks[index].status;
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;

    tasks[index].status = statusOrder[nextIndex];
    renderTasks();

    // Feedback visual
    showAlert("Task status updated!", "success");
  }
}

// Eliminar tarea
function deleteTask(index) {
  if (tasks[index]) {
    tasks.splice(index, 1);
    renderTasks();

    // Feedback visual
    showAlert("Task deleted!", "danger");
  }
}

// Manejar envío del formulario
function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  // Validación
  if (!title) {
    showAlert("Title is required!", "warning");
    return;
  }

  if (!priority) {
    showAlert("Please select a priority!", "warning");
    return;
  }

  // Crear nueva tarea
  const newTask = {
    id: Date.now(),
    title: title,
    description: description,
    priority: priority,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Agregar al array de tareas
  tasks.unshift(newTask);

  // Limpiar formulario
  document.getElementById("form").reset();

  // Renderizar tareas
  renderTasks();

  // Feedback visual
  showAlert("Task created successfully!", "success");
}

// Manejar cambios en filtros
function handleFilterChange(event) {
  const filterId = event.target.id;
  const value =
    event.target.value === "All tasks" ||
    event.target.value === "All priorities"
      ? null
      : event.target.value;

  if (filterId === "filter-status") {
    currentFilter.status = value ? value.toLowerCase().replace(" ", "-") : null;
  } else if (filterId === "filter-priority") {
    currentFilter.priority = value;
  }

  renderTasks();
}

// Mostrar alertas temporales
function showAlert(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText =
    "top: 20px; right: 20px; z-index: 1050; min-width: 300px;";
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  document.body.appendChild(alertDiv);

  // Auto-remover después de 3 segundos
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 3000);
}

//XSS
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
