document.addEventListener("DOMContentLoaded", function () {
    fetchOrders();
});

function fetchOrders() {
    fetch('http://localhost:5000/api/getOrders')
        .then(response => response.json())
        .then(data => {
            const ordersContainer = document.getElementById('ordersContainer');
            ordersContainer.innerHTML = '';
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order[0]}</td> 
                    <td>${order[1]}</td> 
                    <td>${order[6]}</td> 
                    <td>${order[4]}</td> 
                    <td>${order[2]}</td>
                    <td>${order[3]}</td> 
                    <td>${order[5]}</td> 
                `;
                ordersContainer.appendChild(row);
            });
        });
}

document.getElementById('submitOrder').addEventListener('click', function () {
    const idClient = document.getElementById('idClient').value;
    const idEmployee = document.getElementById('idEmployee').value;
    const idProduct = document.getElementById('idProduct').value;
    const quantity = document.getElementById('quantity').value;
    const totalAmount = document.getElementById('totalAmount').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const orderData = {
        idClient,
        idEmployee,
        idProduct,
        quantity,
        totalAmount,
        paymentMethod
    };
    fetch('http://localhost:5000/api/createOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Замовлення успішно створене') {
                fetchOrders();
            }
        })
        .catch(error => console.error('Error:', error));
});

// Відображення модальних вікон
function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

document.getElementById("topProductsButton").addEventListener("click", function () {
    fetch('http://localhost:5000/api/topProducts')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('topProductsList');
            list.innerHTML = '';
            data.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.Product_Name} (Замовлень: ${product.OrderCount})`;
                list.appendChild(li);
            });
            showModal('topProductsModal');
        });
});

document.getElementById("topClientsButton").addEventListener("click", function () {
    fetch('http://localhost:5000/api/topClients')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('topClientsList');
            list.innerHTML = '';
            data.forEach(client => {
                const li = document.createElement('li');
                li.textContent = `${client.First_name} ${client.Last_name} (Замовлень: ${client.OrderCount})`;
                list.appendChild(li);
            });
            showModal('topClientsModal');
        });
});

document.getElementById("topEmployeesButton").addEventListener("click", function () {
    fetch('http://localhost:5000/api/employeeOrders')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('employeesList');
            list.innerHTML = '';
            data.forEach(employee => {
                const li = document.createElement('li');
                li.textContent = `${employee.First_name} ${employee.Last_name} (Замовлень: ${employee.OrderCount})`;
                list.appendChild(li);
            });
            showModal('employeesModal');
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById("closeTopProductsModal").addEventListener("click", function () {
    closeModal('topProductsModal');
});

document.getElementById("closeTopClientsModal").addEventListener("click", function () {
    closeModal('topClientsModal');
});

document.getElementById("closeEmployeesModal").addEventListener("click", function () {
    closeModal('employeesModal');
});