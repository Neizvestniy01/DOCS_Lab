document.addEventListener('DOMContentLoaded', function () {
    const addUserForm = document.getElementById('add-user-form');
    const clientTable = document.getElementById('clientTable');
    const sortAscBtn = document.getElementById('sortAscBtn');
    const sortDescBtn = document.getElementById('sortDescBtn');

    addUserForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const clientData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            phoneNumber: document.getElementById('phone-number').value,
            email: document.getElementById('email').value
        };
        fetch('http://localhost:5000/api/addClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success !== false) {
                addUserForm.reset();
                loadClients();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function loadClients(order = 'asc') {
        fetch(`http://localhost:5000/api/sortClients?order=${order}`)
            .then(response => response.json())
            .then(clients => {
                clientTable.innerHTML = '';
                clients.forEach(client => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${client.id_Client}</td>
                        <td>${client.First_name}</td>
                        <td>${client.Last_name}</td>
                        <td>${client.Email}</td>
                        <td>${client.Phone_Number}</td>
                        <td><button class="delete-btn" data-id="${client.id_Client}">Видалити</button></td>
                    `;
                    clientTable.appendChild(row);
                });
                const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const clientId = button.getAttribute('data-id');
                        deleteClient(clientId);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    loadClients();

    sortAscBtn.addEventListener('click', function () {
        loadClients('asc');
    });
    sortDescBtn.addEventListener('click', function () {
        loadClients('desc');
    });

    function deleteClient(clientId) {
        fetch('http://localhost:5000/api/deleteClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: clientId })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadClients();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});