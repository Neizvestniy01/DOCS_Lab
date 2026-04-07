document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const authMessage = document.getElementById("authMessage");
    const logoutBtn = document.getElementById("logoutBtn");
    let currentUser = null;

    function registerUser(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const position = document.getElementById("position").value.trim();
    if (!firstName || !lastName || !phoneNumber || !email || !position) {
        authMessage.textContent = "Будь ласка, заповніть усі поля!";
        authMessage.style.color = "red";
        return;
    }
    fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            position: position
        })
    })
    .then(response => response.json())
    .then(data => {
        authMessage.textContent = data.message;
        authMessage.style.color = data.success ? "green" : "red";
    })
    .catch(error => {
        authMessage.textContent = "Помилка при додаванні працівника.";
        authMessage.style.color = "red";
    });
}

function loginUser(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const position = document.getElementById("position").value.trim();
    if (!firstName || !lastName || !phoneNumber || !email || !position) {
        authMessage.textContent = "Будь ласка, заповніть усі поля!";
        authMessage.style.color = "red";
        return;
    }
    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            position: position
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentUser = email;
            alert("Вхід успішний!");
            window.location.href = "employees.html";
        } else {
            authMessage.textContent = "Невірні дані для входу!";
            authMessage.style.color = "red";
        }
    })
    .catch(error => {
        authMessage.textContent = "Помилка при вході.";
        authMessage.style.color = "red";
    });
}

    function logoutUser() {
        currentUser = null;
        alert("Ви вийшли з системи.");
        window.location.href = "index.html";
    }

    if (document.getElementById("registerBtn")) {
        document.getElementById("registerBtn").addEventListener("click", registerUser);
    }
    if (document.getElementById("loginBtn")) {
        document.getElementById("loginBtn").addEventListener("click", loginUser);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }
});