// Academic planner
// tasks are kept in an array and saved to localStorage so they stay after refresh

let tasks = [];
let filter = "all";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const titleError = document.getElementById("task-title-error");
const list = document.getElementById("task-list");
const emptyBox = document.getElementById("empty-state");
const clearBtn = document.getElementById("clear-done");

// a few tasks to start with so the page isn't empty the first time
const exampleTasks = [
  { id: 1, title: "Submit web technologies term project", course: "CSC 106", priority: "high", due: "2026-11-15", done: false },
  { id: 2, title: "Revise C loops and arrays", course: "COS 102", priority: "medium", due: "2026-11-20", done: false },
  { id: 3, title: "Start Elementary Mathematics II lessons", course: "MTH 102", priority: "medium", due: "", done: false },
  { id: 4, title: "Read notes on the DOM", course: "CSC 106", priority: "low", due: "", done: true }
];

function loadTasks() {
  try {
    const data = localStorage.getItem("plannerTasks");
    tasks = data ? JSON.parse(data) : exampleTasks;
  } catch (e) {
    tasks = exampleTasks;
  }
}

function saveTasks() {
  try {
    localStorage.setItem("plannerTasks", JSON.stringify(tasks));
  } catch (e) {
    console.log("could not save tasks");
  }
}

function addTask(title, course, priority, due) {
  const task = {
    id: Date.now(),
    title: title,
    course: course,
    priority: priority,
    due: due,
    done: false
  };
  tasks.push(task);
  saveTasks();
  showTasks();
}

function toggleDone(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = !tasks[i].done;
    }
  }
  saveTasks();
  showTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  showTasks();
}

// "2026-11-15" -> "Due 15 Nov 2026"
function formatDate(due) {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00");
  return "Due " + d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(task) {
  if (!task.due || task.done) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due + "T00:00") < today;
}

// not done first, then earliest due date, tasks with no date go last
function sortTasks(arr) {
  const order = { high: 1, medium: 2, low: 3 };
  return arr.slice().sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.due && !b.due) return -1;
    if (!a.due && b.due) return 1;
    if (a.due !== b.due) return a.due < b.due ? -1 : 1;
    return order[a.priority] - order[b.priority];
  });
}

function createTaskItem(task) {
  const li = document.createElement("li");
  li.className = task.done ? "task done" : "task";
  li.setAttribute("data-priority", task.priority);

  // tick button
  const checkBtn = document.createElement("button");
  checkBtn.className = "check";
  checkBtn.type = "button";
  checkBtn.setAttribute("aria-label", task.done ? "Mark as not done" : "Mark as done");
  checkBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  checkBtn.addEventListener("click", () => toggleDone(task.id));

  // title + details
  const info = document.createElement("div");
  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title; // textContent so html typed in doesn't run

  const meta = document.createElement("div");
  meta.className = "task-meta";
  let dueText = formatDate(task.due);
  let dueClass = "";
  if (isOverdue(task)) {
    dueText += " (overdue)";
    dueClass = "overdue";
  }
  meta.innerHTML =
    '<span class="course"></span><span class="' + dueClass + '">' + dueText + "</span><span>" +
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + " priority</span>";
  meta.querySelector(".course").textContent = task.course;

  info.appendChild(title);
  info.appendChild(meta);

  // delete button
  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.type = "button";
  delBtn.setAttribute("aria-label", "Delete task");
  delBtn.innerHTML =
    '<svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  delBtn.addEventListener("click", () => {
    li.classList.add("removing"); // slide out first
    setTimeout(() => deleteTask(task.id), 220);
  });

  li.appendChild(checkBtn);
  li.appendChild(info);
  li.appendChild(delBtn);
  return li;
}

function updateProgress() {
  const total = tasks.length;
  let doneCount = 0;
  for (const t of tasks) {
    if (t.done) doneCount++;
  }
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  document.getElementById("count-all").textContent = total;
  document.getElementById("count-active").textContent = total - doneCount;
  document.getElementById("count-done").textContent = doneCount;
  document.getElementById("progress-percent").textContent = percent + "%";
  document.getElementById("progress-text").textContent =
    total > 0 ? doneCount + " of " + total + " tasks done" : "No tasks yet";

  // ring circumference is 2 * pi * 34 = 213.6
  const ring = document.getElementById("progress-ring");
  ring.style.strokeDashoffset = 213.6 - (213.6 * percent) / 100;

  clearBtn.disabled = doneCount === 0;
}

function showTasks() {
  list.innerHTML = "";

  let shown = sortTasks(tasks);
  if (filter === "active") shown = shown.filter((t) => !t.done);
  if (filter === "done") shown = shown.filter((t) => t.done);

  shown.forEach((task) => {
    list.appendChild(createTaskItem(task));
  });

  // message when nothing to show
  if (shown.length === 0) {
    emptyBox.hidden = false;
    if (tasks.length === 0) {
      document.getElementById("empty-title").textContent = "No tasks yet";
      document.getElementById("empty-text").textContent = "Add your first task using the form.";
    } else if (filter === "active") {
      document.getElementById("empty-title").textContent = "Everything is done";
      document.getElementById("empty-text").textContent = "Add a new task or take a break.";
    } else {
      document.getElementById("empty-title").textContent = "No completed tasks";
      document.getElementById("empty-text").textContent = "Tick a task when you finish it and it will show here.";
    }
  } else {
    emptyBox.hidden = true;
  }

  updateProgress();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();

  if (title === "") {
    titleError.textContent = "Enter a task name.";
    titleInput.parentElement.classList.add("has-error");
    titleInput.focus();
    return;
  }

  addTask(
    title,
    document.getElementById("task-course").value,
    document.getElementById("task-priority").value,
    document.getElementById("task-due").value
  );

  form.reset();
  document.getElementById("task-priority").value = "medium";
  titleInput.focus();
});

// remove the error once they start typing
titleInput.addEventListener("input", () => {
  titleError.textContent = "";
  titleInput.parentElement.classList.remove("has-error");
});

// All / To do / Done buttons
const filterBtns = document.querySelectorAll(".filters button");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach((b) => b.setAttribute("aria-pressed", b === btn));
    showTasks();
  });
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  showTasks();
});

loadTasks();
showTasks();
