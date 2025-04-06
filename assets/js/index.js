document.addEventListener("DOMContentLoaded", () => {
  // Load data initially
  loadDashboardData();
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

async function loadDashboardData() {
  try {
    const [expRes, catRes] = await Promise.all([
      fetch("data/expenses.json"),
      fetch("data/categories.json"),
    ]);
    const [expenses, categories] = await Promise.all([expRes.json(), catRes.json()]);

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.category_id] = cat.name;
    });

    let categoryTotals = {};

    expenses.forEach((expense) => {
      const catName = categoryMap[expense.category_id] || "Other";
      categoryTotals[catName] = (categoryTotals[catName] || 0) + parseFloat(expense.amount);
    });


    renderChart(categoryTotals);
  } catch (error) {
    console.error("Failed to load dashboard:", error);
  }
}

let currentChart;

function renderChart(data) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (currentChart) currentChart.destroy();

  currentChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Expense by this Category",
          data: Object.values(data),
          backgroundColor: [
            "#f94144", "#f3722c", "#f8961e", "#f9844a",
            "#f9c74f", "#90be6d", "#43aa8b",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
          },
        },
      },
    },
  });
}

let expenses = [];

async function listSection() {
  try {
    const [expRes, catRes] = await Promise.all([
      fetch("data/expenses.json"),
      fetch("data/categories.json"),
    ]);

    expenses = await expRes.json();
    const categories = await catRes.json();

    // Map category_id to category name for easy lookup
    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.category_id, c.name])
    );

    const tbody = document.getElementById("expenseTableBody");
    tbody.innerHTML = "";

    expenses.forEach((expense, index) => {
      const tr = document.createElement("tr");
      tr.className =
        "border-b dark:border-gray-700 expense-list-item transition";

      tr.innerHTML = `
        <td class="px-4 py-3 font-semibold text-color-text whitespace-nowrap">₹${expense.amount}</td>
        <td class="px-4 py-3 whitespace-nowrap">${categoryMap[expense.category_id] || "N/A"}</td>
        <td class="px-4 py-3 whitespace-nowrap">${expense.subcategory || "-"}</td>
        <td class="px-4 py-3 whitespace-nowrap">${expense.date}</td>
        <td class="px-4 py-3 whitespace-nowrap">${expense.payment_mode}</td>
        <td class="px-4 py-3 whitespace-nowrap">
          <button 
            onclick="openEditModal(${index})"
            class="text-accent hover:underline flex items-center gap-1"
          >
            ✏️ <span>Edit</span>
          </button>
          <button 
            onclick="confirmDelete(${index})"
            class="text-red-500 hover:underline flex items-center gap-1"
          >
            🗑️ <span>Delete</span>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Failed to load expenses:", err);
  }
}

let sortDirections = {};

function sortTable(colIndex) {
  const table = document.getElementById("expenseTable");
  const tbody = document.getElementById("expenseTableBody");
  const rows = Array.from(tbody.rows);

  // Toggle sort direction for the column
  sortDirections[colIndex] = !sortDirections[colIndex];
  const direction = sortDirections[colIndex] ? 1 : -1;

  const sorted = rows.sort((a, b) => {
    let valA = a.cells[colIndex].innerText.trim();
    let valB = b.cells[colIndex].innerText.trim();

    // Check if value looks like a date (yyyy-mm-dd or dd/mm/yyyy or similar)
    const dateA = Date.parse(valA);
    const dateB = Date.parse(valB);

    const isDate = !isNaN(dateA) && !isNaN(dateB);

    if (isDate) {
      return direction * (new Date(dateA) - new Date(dateB));
    }

    // Fallback: Check if numeric
    const numA = parseFloat(valA.replace(/[^0-9.-]+/g, ""));
    const numB = parseFloat(valB.replace(/[^0-9.-]+/g, ""));
    const isNumeric = !isNaN(numA) && !isNaN(numB);

    if (isNumeric) {
      return direction * (numA - numB);
    }

    // String comparison
    return direction * valA.toLowerCase().localeCompare(valB.toLowerCase(), undefined, { numeric: true });
  });

  tbody.innerHTML = "";
  sorted.forEach(row => tbody.appendChild(row));
}


// Edit modal functions
function openEditModal(index) {
  const exp = expenses[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("editAmount").value = exp.amount;
  document.getElementById("editSubcategory").value = exp.subcategory;
  document.getElementById("editMode").value = exp.payment_mode;
  document.getElementById("expenseModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("expenseModal").classList.add("hidden");
}

function saveEdit(event) {
  event.preventDefault();
  const index = document.getElementById("editIndex").value;
  expenses[index].amount = document.getElementById("editAmount").value;
  expenses[index].subcategory = document.getElementById("editSubcategory").value;
  expenses[index].payment_mode = document.getElementById("editMode").value;
  closeModal();
  listSection(); // refresh
}

function confirmDelete(index) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses.splice(index, 1);
    listSection();
  }
}
