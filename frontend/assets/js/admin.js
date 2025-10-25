// === CampusConnect Admin Dashboard ===

// ✅ Base API URL
const API = "http://localhost:5000/api";

// =============================
// GLOBAL DOM ELEMENTS
// =============================
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".admin-section");
const title = document.getElementById("section-title");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalForm = document.getElementById("modal-form");
const closeModal = document.getElementById("close-modal");

// =============================
// NAVIGATION CONTROL
// =============================
navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    navItems.forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    sections.forEach((s) => s.classList.remove("active"));
    document.getElementById(item.dataset.target).classList.add("active");
    title.textContent = item.textContent.replace(/[^\w\s]/g, "").trim();
  });
});

// Refresh
document.getElementById("refresh-btn").addEventListener("click", () => {
  loadCounts();
  loadAll();
});

// =============================
// ANIMATED COUNT FUNCTION
// =============================
function animateCount(el, value) {
  let start = 0;
  const step = Math.ceil(value / 20);
  const interval = setInterval(() => {
    start += step;
    if (start >= value) {
      start = value;
      clearInterval(interval);
    }
    el.textContent = start;
  }, 20);
}

// =============================
// LOAD DASHBOARD COUNTS
// =============================
async function loadCounts() {
  const [events, announcements, faculty, messages] = await Promise.all([
    fetch(`${API}/events`).then((r) => r.json()),
    fetch(`${API}/announcements`).then((r) => r.json()),
    fetch(`${API}/faculty`).then((r) => r.json()),
    fetch(`${API}/contact`).then((r) => r.json()),
  ]);

  animateCount(document.getElementById("count-events"), events.length);
  animateCount(document.getElementById("count-announcements"), announcements.length);
  animateCount(document.getElementById("count-faculty"), faculty.length);
  animateCount(document.getElementById("count-messages"), messages.length);
}

// =============================
// LOAD ALL DATA SECTIONS
// =============================
async function loadAll() {
  loadSection("events", "event-list");
  loadSection("announcements", "announce-list");
  loadSection("faculty", "faculty-list");
  loadSection("contact", "message-list");
}

// Generic Loader
async function loadSection(type, targetId) {
  const res = await fetch(`${API}/${type}`);
  const data = await res.json();
  const container = document.getElementById(targetId);
  container.innerHTML = data
    .map(
      (d) => `
    <div class="data-card">
      <h4>${d.title || d.name}</h4>
      <p>${d.description || d.department || d.message || ""}</p>
      <small>${d.email || new Date(d.date).toLocaleDateString() || ""}</small>
      <div class="card-actions">
        ${type !== "contact"
          ? `<button class="btn-edit" onclick="openEditModal('${type}','${d._id}')">Edit</button>`
          : ""
        }
        <button class="btn-delete" onclick="deleteItem('${type}','${d._id}')">Delete</button>
      </div>
    </div>`
    )
    .join("");
}

// =============================
// DELETE FUNCTION
// =============================
async function deleteItem(type, id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  await fetch(`${API}/${type}/${id}`, { method: "DELETE" });
  loadCounts();
  loadAll();
}

// =============================
// MODAL HANDLERS
// =============================
function openModal(titleText, fields, submitHandler) {
  modalTitle.textContent = titleText;
  modalForm.innerHTML = fields;
  modal.classList.remove("hidden");

  modalForm.onsubmit = async (e) => {
    e.preventDefault();
    await submitHandler();
    modal.classList.add("hidden");
    loadAll();
    loadCounts();
  };
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));

// =============================
// ADD HANDLERS
// =============================
document.getElementById("add-event-btn").addEventListener("click", () => {
  openModal(
    "Add Event",
    `
      <input id="title" placeholder="Event Title" required />
      <textarea id="description" placeholder="Event Description"></textarea>
      <input id="date" type="date" required />
      <button class="btn-primary" type="submit">Save</button>
    `,
    async () => {
      const newEvent = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value,
      };
      await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
    }
  );
});

document.getElementById("add-announcement-btn").addEventListener("click", () => {
  openModal(
    "Add Announcement",
    `
      <input id="title" placeholder="Announcement Title" required />
      <textarea id="content" placeholder="Announcement Content" required></textarea>
      <button class="btn-primary" type="submit">Save</button>
    `,
    async () => {
      const newAnn = {
        title: document.getElementById("title").value,
        content: document.getElementById("content").value,
      };
      await fetch(`${API}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnn),
      });
    }
  );
});

document.getElementById("add-faculty-btn").addEventListener("click", () => {
  openModal(
    "Add Faculty Member",
    `
      <input id="name" placeholder="Faculty Name" required />
      <input id="department" placeholder="Department" required />
      <input id="email" type="email" placeholder="Email" />
      <button class="btn-primary" type="submit">Save</button>
    `,
    async () => {
      const newFaculty = {
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        email: document.getElementById("email").value,
      };
      await fetch(`${API}/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaculty),
      });
    }
  );
});

// =============================
// EDIT HANDLER
// =============================
async function openEditModal(type, id) {
  const res = await fetch(`${API}/${type}/${id}`);
  const data = await res.json();
  let formHTML = "";
  let updateData;

  if (type === "events") {
    formHTML = `
      <input id="title" value="${data.title}" required />
      <textarea id="description">${data.description || ""}</textarea>
      <input id="date" type="date" value="${data.date ? data.date.split('T')[0] : ""}" required />
      <button class="btn-primary" type="submit">Update</button>
    `;
    updateData = async () => ({
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      date: document.getElementById("date").value,
    });
  } else if (type === "announcements") {
    formHTML = `
      <input id="title" value="${data.title}" required />
      <textarea id="content">${data.content || ""}</textarea>
      <button class="btn-primary" type="submit">Update</button>
    `;
    updateData = async () => ({
      title: document.getElementById("title").value,
      content: document.getElementById("content").value,
    });
  } else if (type === "faculty") {
    formHTML = `
      <input id="name" value="${data.name}" required />
      <input id="department" value="${data.department}" required />
      <input id="email" type="email" value="${data.email || ""}" />
      <button class="btn-primary" type="submit">Update</button>
    `;
    updateData = async () => ({
      name: document.getElementById("name").value,
      department: document.getElementById("department").value,
      email: document.getElementById("email").value,
    });
  }

  openModal(`Edit ${type.slice(0, -1)}`, formHTML, async () => {
    const updated = await updateData();
    await fetch(`${API}/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  });
}

// =============================
// INITIAL LOAD
// =============================
loadCounts();
loadAll();
