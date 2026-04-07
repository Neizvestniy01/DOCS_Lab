document.addEventListener("DOMContentLoaded", () => {
    const employeeTable = document.getElementById("employeeTable");
    const updateModal = document.getElementById("updateModal");
    const closeModal = document.getElementById("closeModal");
    const updateForm = document.getElementById("updateForm");
    let selectedEmployeeId = null;

    function fetchEmployees(order = "asc") {
        fetch(`http://localhost:5000/api/sortEmployees?order=${order}`)
            .then(response => response.json())
            .then(data => {
                employeeTable.innerHTML = "";
                data.employees.forEach(employee => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${employee[0]}</td>
                        <td>${employee[1]}</td>
                        <td>${employee[2]}</td>
                        <td>${employee[3]}</td>
                        <td>${employee[5]}</td>
                        <td>${employee[4]}</td>
                        <td>
                            <button class="updateBtn" data-id="${employee[0]}">Змінити</button>
                            <button class="deleteBtn" data-id="${employee[0]}">Видалити</button>
                        </td>
                    `;
                    employeeTable.appendChild(row);
                });

                document.querySelectorAll(".deleteBtn").forEach(button =>
                    button.addEventListener("click", () => deleteEmployee(button.dataset.id))
                );
                document.querySelectorAll(".updateBtn").forEach(button =>
                    button.addEventListener("click", () => openUpdateModal(button.dataset.id))
                );
            });
    }

    function deleteEmployee(id) {
    fetch("http://localhost:5000/api/deleteEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchEmployees();
    });
}

    function openUpdateModal(id) {
        selectedEmployeeId = id;
        updateModal.style.display = "block";
    }

    closeModal.addEventListener("click", () => {
        updateModal.style.display = "none";
    });

    updateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const updateField = document.getElementById("updateField").value;
        const updateValue = document.getElementById("updateValue").value;
        if (!updateValue) return alert("Поле не може бути порожнім!");
        fetch("http://localhost:5000/api/updateEmployee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedEmployeeId, field: updateField, value: updateValue })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                updateModal.style.display = "none";
                fetchEmployees();
            });
    });
    document.getElementById("sortAscBtn").addEventListener("click", () => fetchEmployees("asc"));
    document.getElementById("sortDescBtn").addEventListener("click", () => fetchEmployees("desc"));
    fetchEmployees();
});