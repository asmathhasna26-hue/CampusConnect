const API = "http://localhost:5000/api";

/* --- Home page announcements preview --- */
const announcementList = document.getElementById("announcement-list");
if (announcementList) {
  fetch(`${API}/announcements`)
    .then(r => r.json())
    .then(data => {
      if (!data.length) return (announcementList.innerHTML = "<p>No announcements yet.</p>");
      data.slice(0, 3).forEach(a => {
        const d = document.createElement("div");
        d.className = "announcement-card";
        d.innerHTML = `<h4>${a.title}</h4><p>${a.content}</p><small>${new Date(a.date).toLocaleDateString()}</small>`;
        announcementList.appendChild(d);
      });
    });
}

/* --- Events Page --- */
const eventsContainer = document.getElementById("events-container");
if (eventsContainer) {
  fetch(`${API}/events`)
    .then(r => r.json())
    .then(data => {
      if (!data.length) return (eventsContainer.innerHTML = "<p>No events found.</p>");
      data.forEach(e => {
        const div = document.createElement("div");
        div.className = "content-card";
        div.innerHTML = `<h3>${e.title}</h3><p>${e.description}</p><small>${new Date(e.date).toLocaleDateString()}</small>`;
        eventsContainer.appendChild(div);
      });
    });
}

/* --- Announcements Page --- */
const announcementsContainer = document.getElementById("announcements-container");
if (announcementsContainer) {
  fetch(`${API}/announcements`)
    .then(r => r.json())
    .then(data => {
      if (!data.length) return (announcementsContainer.innerHTML = "<p>No announcements available.</p>");
      data.forEach(a => {
        const div = document.createElement("div");
        div.className = "announcement-card";
        div.innerHTML = `<h3>${a.title}</h3><p>${a.content}</p><small>${new Date(a.date).toLocaleString()}</small>`;
        announcementsContainer.appendChild(div);
      });
    });
}

/* --- Faculty Page --- */
const facultyContainer = document.getElementById("faculty-container");
if (facultyContainer) {
  fetch(`${API}/faculty`)
    .then(r => r.json())
    .then(data => {
      if (!data.length) return (facultyContainer.innerHTML = "<p>No faculty data.</p>");
      data.forEach(f => {
        const div = document.createElement("div");
        div.className = "content-card";
        div.innerHTML = `
          <img src="${f.photo || 'https://via.placeholder.com/120'}" alt="${f.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;">
          <h3>${f.name}</h3>
          <p>${f.department || ''}</p>
          <small>${f.email || ''}</small>`;
        facultyContainer.appendChild(div);
      });
    });
}

/* --- Contact Page --- */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("form-status");
    status.textContent = "Sending...";
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const result = await res.json();
      status.textContent = result.message || "Message sent!";
      contactForm.reset();
    } catch (err) {
      status.textContent = "Error sending message.";
    }
  });
}


