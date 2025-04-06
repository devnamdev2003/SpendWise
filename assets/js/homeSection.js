document.addEventListener("DOMContentLoaded", () => {
    // Load data initially
    loadDashboardData();
});


let charts = {};

async function loadDashboardData() {
    try {
        const [expRes, catRes] = await Promise.all([
            fetch("http://localhost:3000/expenses/"),
            fetch("http://localhost:3000/categories/"),
        ]);

        const [expenses, categories] = await Promise.all([
            expRes.json(),
            catRes.json(),
        ]);

        const categoryMap = {};
        categories.forEach((cat) => {
            categoryMap[cat.category_id] = cat.name;
        });



        // 1. Daily Expenses
        const dailyTotals = {};

        expenses.forEach(exp => {
            const rawDate = new Date(exp.date);
            console.log(exp);
            const formattedDate = `${rawDate.getFullYear()}-${String(rawDate.getMonth() + 1).padStart(2, '0')}-${String(rawDate.getDate()).padStart(2, '0')} ${String(exp.time.split(":")[0])}:${String(exp.time.split(":")[1])}:${String(exp.time.split(":")[2])}`;

            console.log("👉 Raw:", rawDate, "| 📅 Formatted:", formattedDate);

            dailyTotals[formattedDate] = (dailyTotals[formattedDate] || 0) + parseFloat(exp.amount);
        });


        renderChart("dailyChart", "line", {
            labels: Object.keys(dailyTotals),
            data: Object.values(dailyTotals),
            label: "Daily Spending",
            borderColor: "#3498db",
            backgroundColors: ["#3498db"]
        });

        // 2. Top 5 Expenses
        const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
        const topLabels = sortedExpenses.map(e => `${e.subcategory || "Unknown"} - ₹${e.amount}`);
        const topData = sortedExpenses.map(e => e.amount);

        renderChart("topExpensesChart", "bar", {
            labels: topLabels,
            data: topData,
            label: "Top 5 Expenses",
            backgroundColors: "#e67e22"
        });

        // 3. Category-wise Totals
        const categoryTotals = {};
        const categoryColors = {};
        categories.forEach(cat => {
            categoryColors[cat.name] = cat.color;
        });

        expenses.forEach((expense) => {
            const catName = categoryMap[expense.category_id] || "Other";
            categoryTotals[catName] = (categoryTotals[catName] || 0) + parseFloat(expense.amount);
        });

        renderChart("categoryChart", "doughnut", {
            labels: Object.keys(categoryTotals),
            data: Object.values(categoryTotals),
            label: "Expenses by Category",
            backgroundColors: Object.keys(categoryTotals).map(cat => categoryColors[cat] || "#ccc")
        });
        // 4. Payment Mode Usage
        const paymentModeTotals = {};
        expenses.forEach(exp => {
            const mode = exp.payment_mode || "Other";
            paymentModeTotals[mode] = (paymentModeTotals[mode] || 0) + parseFloat(exp.amount);
        });

        renderChart("paymentChart", "pie", {
            labels: Object.keys(paymentModeTotals),
            data: Object.values(paymentModeTotals),
            label: "Payment Mode Usage",
            backgroundColors: ["#f39c12", "#e74c3c", "#2ecc71", "#9b59b6", "#1abc9c"]
        });



    } catch (error) {
        console.error("Failed to load dashboard:", error);
    }
}

function renderChart(id, type, { labels, data, label, backgroundColors, borderColor }) {
    const ctx = document.getElementById(id).getContext("2d");

    // Detect dark mode
    const isDarkMode = document.documentElement.classList.contains("dark");

    // Destroy previous chart instance if exists
    if (charts[id]) {
        charts[id].destroy();
    }

    const datasetConfig = {
        label: label,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColor || backgroundColors,
        borderWidth: 1
    };

    if (type === "line") {
        datasetConfig.fill = false;
        datasetConfig.tension = 0.3;
    }

    charts[id] = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [datasetConfig]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: type === "bar" || type === "line" ? "top" : "bottom",
                    labels: {
                        color: isDarkMode ? "#fff" : "#111" // High contrast for light mode
                    }
                },
                title: {
                    display: false
                }
            },
            scales: type === "bar" || type === "line" ? {
                x: {
                    ticks: {
                        color: isDarkMode ? "#ddd" : "#111"
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: isDarkMode ? "#ddd" : "#111"
                    }
                }
            } : {}
        }
    });
}
