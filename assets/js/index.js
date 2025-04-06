document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.getElementById("modeToggle");

  // Initialize toggle based on theme
  toggle.checked = document.documentElement.classList.contains("dark");

  // Theme toggle event
  toggle.addEventListener("change", () => {
    document.documentElement.classList.toggle("dark");
  });


  const timeInput = document.getElementById("expenseTime");
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  timeInput.value = `${hours}:${minutes}`;

  const dateInput = document.getElementById("expenseDate");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  dateInput.value = `${year}-${month}-${day}`;


});


const showSection = (id) => {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });

  // Show selected section
  document.getElementById(id).classList.remove("hidden");
  if (id === "list") {
    listSection();
  }
  else if (id === "home") {
    loadDashboardData();

  }
  // On mobile, close the sidebar after selection
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");

  if (window.innerWidth < 768) {
    sidebar.classList.add("hidden");
    menuToggle.classList.remove("hidden");
  }
};

const toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar");
  const isHidden = sidebar.classList.contains("hidden");

  if (isHidden) {
    sidebar.classList.remove("hidden");
  } else {
    sidebar.classList.add("hidden");
  }
};