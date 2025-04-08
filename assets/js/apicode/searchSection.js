document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;

    try {
        const [res, catRes] = await Promise.all([
            fetch(`${url}expenses/search?from=${from}&to=${to}`),
            fetch(`${url}categories/`)
        ]);

        const expenses = await res.json();
        const categories = await catRes.json();

        const categoryMap = Object.fromEntries(categories.map(c => [c.category_id, c.name]));

        const tbody = document.getElementById("searchResultsTableBody");
        tbody.innerHTML = "";

        expenses.forEach(expense => {
            const tr = document.createElement("tr");
            tr.className = "border-b dark:border-gray-700 expense-list-item transition";
            const expDate = new Date(expense.date);
            let expDateTime = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}-${String(expDate.getDate()).padStart(2, '0')} ${expense.time.split(":")[0]}:${expense.time.split(":")[1]}:${expense.time.split(":")[2]}`;
            tr.innerHTML = `
          <td class="px-4 py-3 font-semibold text-color-text whitespace-nowrap">₹${expense.amount}</td>
          <td class="px-4 py-3 whitespace-nowrap">${categoryMap[expense.category_id] || "N/A"}</td>
          <td class="px-4 py-3 whitespace-nowrap">${expense.subcategory || "NA"}</td>
          <td class="px-4 py-3 whitespace-nowrap">${expDateTime}</td>
          <td class="px-4 py-3 whitespace-nowrap">${expense.payment_mode}</td>
          <td class="px-4 py-3 whitespace-nowrap">${expense.location || "NA"}</td>
        `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Search failed:", error);
        showToast("Failed to search expenses. Try again.", "error");
    }
});
