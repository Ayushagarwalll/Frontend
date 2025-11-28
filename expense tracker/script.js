const form = document.getElementById("expense-form");
const errorBox = document.getElementById("error");
const tableBody = document.querySelector("#expense-table tbody");
const chart = document.getElementById("chart");
const noData = document.getElementById("no-data");

let expenses = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amountValue = document.getElementById("amount").value;
    const note = document.getElementById("note").value.trim();

    if (!date || !category || !amountValue) {
        errorBox.textContent = "Please fill date, category and amount.";
        return;
    }

    const amount = Number(amountValue);

    if (isNaN(amount) || amount <= 0) {
        errorBox.textContent = "Amount must be positive.";
        return;
    }

    errorBox.textContent = "";

    const newExpense = { id: Date.now(), date, category, amount, note };

    expenses = [...expenses, newExpense];

    form.reset();

    renderTable();
    renderChart();
});

function renderTable() {
    tableBody.innerHTML = "";

    expenses.forEach((expense, index) => {
        const { date, category, amount, note } = expense;
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${date}</td>
            <td>${category}</td>
            <td>${note || "-"}</td>
            <td>₹${amount.toFixed(2)}</td>
        `;

        tableBody.appendChild(tr);
    });
}

function renderChart() {
    chart.innerHTML = "";

    if (expenses.length === 0) {
        chart.appendChild(noData);
        noData.style.display = "block";
        return;
    }

    noData.style.display = "none";

    const totals = {};

    expenses.forEach(({ category, amount }) => {
        totals[category] = (totals[category] || 0) + amount;
    });

    const categories = Object.keys(totals);
    const values = Object.values(totals);
    const maxValue = Math.max(...values);

    categories.forEach(cat => {
        const total = totals[cat];

        const bar = document.createElement("div");
        bar.className = "bar";

        const barInner = document.createElement("div");
        barInner.className = "bar-inner";
        barInner.style.height = (total / maxValue) * 150 + "px";

        const valueLabel = document.createElement("div");
        valueLabel.className = "bar-value";
        valueLabel.textContent = "₹" + total.toFixed(0);

        const label = document.createElement("div");
        label.className = "bar-label";
        label.textContent = cat;

        bar.appendChild(valueLabel);
        bar.appendChild(barInner);
        bar.appendChild(label);

        chart.appendChild(bar);
    });
}
