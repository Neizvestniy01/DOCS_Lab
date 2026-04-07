function getSuppliers() {
  fetch('http://localhost:5000/api/suppliers')
    .then(response => response.json())
    .then(suppliers => {
      const tableBody = document.getElementById('suppliers-table-body');
      tableBody.innerHTML = '';
      suppliers.forEach(supplier => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${supplier.id_Supplier}</td>
          <td>${supplier.Supplier_Name}</td>
          <td>${supplier.Contact_Name}</td>
          <td>${supplier.Phone_Number}</td>
          <td>${supplier.Email}</td>
          <td>${supplier.Geolocation}</td>
          <td>
            <button class="delete-btn" onclick="deleteSupplier(${supplier.id_Supplier})">Видалити</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      document.getElementById('error-message').textContent = 'Помилка при отриманні постачальників: ' + error.message;
    });
}
getSuppliers();

function deleteSupplier(id) {
  if (confirm('Ви впевнені, що хочете видалити цього постачальника?')) {
    fetch(`http://localhost:5000/api/delete-supplier/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
        getSuppliers();
      } else {
        document.getElementById('error-message').textContent = data.error;
      }
    })
    .catch(error => {
      document.getElementById('error-message').textContent = 'Помилка при видаленні постачальника: ' + error.message;
    });
  }
}

document.getElementById('supplier-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const supplierName = document.getElementById('supplier-name').value;
  const contactName = document.getElementById('contact-name').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const email = document.getElementById('email').value;
  const geolocation = document.getElementById('geolocation').value;
  const data = {
    supplierName,
    contactName,
    phoneNumber,
    email,
    geolocation
  };
  fetch('http://localhost:5000/api/add-supplier', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
      getSuppliers();
      document.getElementById('supplier-form').reset();
    } else {
      document.getElementById('error-message').textContent = data.error;
    }
  })
  .catch(error => {
    document.getElementById('error-message').textContent = 'Помилка при додаванні постачальника: ' + error.message;
  });
});