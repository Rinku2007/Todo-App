const BASE_URL = "http://localhost:5000";

// Elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

// ================= SIGNUP =================
async function signup() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();
    msg.innerText = data.msg;

  } catch (err) {
    msg.innerText = "Signup error ❌";
  }
}

// ================= LOGIN =================
async function login() {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      msg.innerText = "Login successful ✅";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      msg.innerText = data.msg;
    }

  } catch (err) {
    msg.innerText = "Server error ❌";
  }
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ================= ADD TASK =================
async function addTask() {
  const token = localStorage.getItem("token");
  const taskInput = document.getElementById("taskInput");
  const title = taskInput.value.trim(); // 🔥 trim important

  // ❌ Empty check
  if (!title) {
    alert("Task cannot be empty ❌");
    return;
  }

  await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    },
    body: JSON.stringify({ title })
  });

  taskInput.value = ""; // 🔥 clear input
  loadTasks();
}

// ================= LOAD TASKS =================
async function loadTasks() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: { "authorization": token }
  });

  const tasks = await res.json();
  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span style="
        text-decoration: ${t.completed ? 'line-through' : 'none'};
        color: ${t.completed ? 'gray' : 'black'};
      ">
        ${t.title}
      </span>
      <div>
        <button onclick="deleteTask('${t._id}')">❌</button>
        <button onclick="markDone('${t._id}', ${t.completed})">
          ${t.completed ? 'Undo' : '✔'}
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// ================= DELETE TASK =================
async function deleteTask(id) {
  const token = localStorage.getItem("token");

  await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: { "authorization": token }
  });

  loadTasks();
}

// ================= MARK DONE =================
async function markDone(id, status) {
  const token = localStorage.getItem("token");

  await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "authorization": token
    },
    body: JSON.stringify({ completed: !status })
  });

  loadTasks();
}

// ================= AUTO LOAD =================
if (window.location.pathname.includes("dashboard.html")) {
  loadTasks();
}