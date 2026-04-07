const productForm = document.getElementById('product-form');
const formToggleButton = document.getElementById('form-toggle-button');
const productList = document.getElementById('product-list');
let currentProductId = null;

formToggleButton.addEventListener('click', () => {
  productForm.style.display = productForm.style.display === 'none' ? 'block' : 'none';
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const productData = {
    productName: document.getElementById('productName').value,
    category: document.getElementById('category').value,
    price: document.getElementById('price').value,
    info: document.getElementById('info').value,
    discount: document.getElementById('discount').value,
    quantity: document.getElementById('quantity').value,
    id_supplier: document.getElementById('id_Supplier').value,
  };
  const response = await fetch('http://localhost:5000/api/add_product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  alert(data.message);
  loadProducts();
});

async function loadProducts() {
  const response = await fetch('http://localhost:5000/api/products');
  const products = await response.json();
  productList.innerHTML = '';
  products.forEach((product) => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.innerHTML = `
      <h3>${product.Product_Name}</h3>
      <p><strong>ID продукту:</strong> ${product.id_Product}</p>
      <p><strong>Категорія:</strong> ${product.Category}</p>
      <p><strong>Ціна:</strong> ${product.Price} ₴</p>
      <p><strong>Опис:</strong> ${product.Info}</p>
      <p><strong>Знижка:</strong> ${product.Discount} %</p>
      <p><strong>Кількість:</strong> ${product.Quantity}</p>
      <p><strong>ID постачальника:</strong>${product.id_Supplier}</p>
      <button onclick="showEditForm(${product.id_Product})">Змінити</button>
      <button onclick="deleteProduct(${product.id_Product})">Видалити товар</button>
    `;
    productList.appendChild(productItem);
  });
}

function showEditForm(productId) {
    currentProductId = productId;
    const editFormContainer = document.getElementById('edit-form-container');
    const editFormOverlay = document.getElementById('edit-form-overlay');
    editFormContainer.innerHTML = `
        <h3>Виберіть, що змінити</h3>
        <select id="edit-option">
            <option value="quantity">Кількість</option>
            <option value="price">Ціна</option>
            <option value="info">Опис</option>
            <option value="discount">Знижка</option>
        </select>
        <button id="confirm-edit">Підтвердити</button>
    `;
    editFormOverlay.style.display = 'block';
    editFormContainer.style.display = 'flex';

    document.getElementById('confirm-edit').addEventListener('click', () => {
        const selectedOption = document.getElementById('edit-option').value;
        if (selectedOption === 'quantity') {
            showReduceForm(currentProductId);
        } else if (selectedOption === 'price') {
            showPriceForm(currentProductId);
        } else if (selectedOption === 'info') {
            showInfoForm(currentProductId);
        } else if (selectedOption === 'discount') {
            showDiscountForm(currentProductId);
        }
        editFormOverlay.style.display = 'none';
        editFormContainer.style.display = 'none';
    });

    editFormOverlay.addEventListener('click', () => {
        editFormOverlay.style.display = 'none';
        editFormContainer.style.display = 'none';
    });
}

function showPriceForm(productId) {
    const priceForm = document.createElement('div');
    priceForm.id = 'text-field-container';
    priceForm.innerHTML = `
        <h3>Введіть нову ціну:</h3>
        <input type="number" id="new-price" placeholder="Нова ціна" />
        <button id="confirm-price">Підтвердити</button>
    `;
    document.body.appendChild(priceForm);

    document.getElementById('confirm-price').addEventListener('click', async () => {
        const newPrice = document.getElementById('new-price').value;
        const response = await fetch('http://localhost:5000/api/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, field: 'Price', value: newPrice }),
        });
        const data = await response.json();
        alert(data.message);
        loadProducts();
        priceForm.remove();
    });
}

function showInfoForm(productId) {
    const infoForm = document.createElement('div');
    infoForm.id = 'text-field-container';
    infoForm.innerHTML = `
        <h3>Введіть новий опис:</h3>
        <textarea id="new-info" placeholder="Новий опис"></textarea>
        <button id="confirm-info">Підтвердити</button>
    `;
    document.body.appendChild(infoForm);

    document.getElementById('confirm-info').addEventListener('click', async () => {
        const newInfo = document.getElementById('new-info').value;
        const response = await fetch('http://localhost:5000/api/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, field: 'Info', value: newInfo }),
        });
        const data = await response.json();
        alert(data.message);
        loadProducts();
        infoForm.remove();
    });
}

function showDiscountForm(productId) {
    const discountForm = document.createElement('div');
    discountForm.id = 'text-field-container';
    discountForm.innerHTML = `
        <h3>Введіть нову знижку:</h3>
        <input type="number" id="new-discount" placeholder="Нова знижка (%)" />
        <button id="confirm-discount">Підтвердити</button>
    `;
    document.body.appendChild(discountForm);

    document.getElementById('confirm-discount').addEventListener('click', async () => {
        const newDiscount = document.getElementById('new-discount').value;
        const response = await fetch('http://localhost:5000/api/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, field: 'Discount', value: newDiscount }),
        });
        const data = await response.json();
        alert(data.message);
        loadProducts();
        discountForm.remove();
    });
}

function showReduceForm(productId) {
    const reduceForm = document.createElement('div');
    reduceForm.id = 'text-field-container';
    reduceForm.innerHTML = `
        <h3>Введіть нову кількість:</h3>
        <input type="number" id="reduce-quantity" placeholder="Нова кількість" min="1" />
        <button id="confirm-reduce">Підтвердити</button>
    `;
    document.body.appendChild(reduceForm);

    document.getElementById('confirm-reduce').addEventListener('click', async () => {
        const quantityToReduce = document.getElementById('reduce-quantity').value;
        const response = await fetch('http://localhost:5000/api/updateProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, field: 'Quantity', value: quantityToReduce }),
        });
        const data = await response.json();
        alert(data.message);
        loadProducts();
        reduceForm.remove();
    });
}

async function deleteProduct(productId) {
  const response = await fetch('http://localhost:5000/api/deleteProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: productId }),
  });
  const data = await response.json();
  alert(data.message);
  loadProducts();
}
loadProducts();

document.getElementById('search-button').addEventListener('click', function() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach(item => {
    const productName = item.querySelector('h3').textContent.toLowerCase();
    if (productName.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});

let sortAscending = true;
document.getElementById('sortPriceButton').addEventListener('click', function() {
    const sortOrder = sortAscending ? 'ASC' : 'DESC';
    fetch(`http://localhost:5000/api/sortByPrice?order=${sortOrder}`)
        .then(response => response.json())
        .then(data => {
            const productContainer = document.getElementById('product-list');
            productContainer.innerHTML = '';
            data.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product-item');
                productElement.innerHTML = `
                    <h3>${product.Product_Name}</h3>
                    <p><strong>ID продукту:</strong> ${product.id_Product}</p>
                    <p><strong>Категорія:</strong> ${product.Category}</p>
                    <p><strong>Ціна:</strong> ${product.Price} ₴</p>
                    <p><strong>Опис:</strong> ${product.Info}</p>
                    <p><strong>Знижка:</strong> ${product.Discount} %</p>
                    <p><strong>Кількість:</strong> ${product.Quantity}</p>
                    <p><strong>ID постачальника:</strong>${product.id_Supplier}</p>
                    <button onclick="showEditForm(${product.id_Product})">Змінити</button>
                    <button onclick="deleteProduct(${product.id_Product})">Видалити товар</button>
                `;
                productContainer.appendChild(productElement);
            });
        })
        .catch(error => {
            console.error('Помилка при отриманні товарів:', error);
        });
    sortAscending = !sortAscending;
});