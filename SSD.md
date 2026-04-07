# System Specification Document (SSD)

## 1. Призначення документа
Цей документ описує технічну специфікацію системи `Brew & Bloom`: архітектуру, модулі, API, дані, обмеження та нефункціональні вимоги.

## 2. Огляд системи
Система реалізує веб-застосунок для обліку операцій кав'ярні:
- керування товарами;
- керування клієнтами;
- керування працівниками;
- керування постачальниками;
- створення і перегляд замовлень;
- базова аналітика.

## 3. Архітектура
- **Frontend:** статичні сторінки `HTML/CSS/JavaScript`.
- **Backend:** `Flask` REST API (`main.py`).
- **База даних:** `MySQL` (`kafeteriy1`).
- **Інтеграція:** фронтенд звертається до `http://localhost:5000/api/...`.
- **CORS:** дозволений для всіх origin (`*`).

## 4. Технологічний стек
- Python + Flask
- mysql-connector-python
- Flask-CORS
- MySQL
- JavaScript (без фреймворків)

## 5. Логічні модулі
- **Auth Module**
  - Реєстрація працівника.
  - Логін працівника.
  - Логаут.
- **Employees Module**
  - Список, сортування, оновлення полів, видалення.
- **Clients Module**
  - Додавання, список, сортування, оновлення, видалення.
- **Products Module**
  - Додавання, список, сортування за ціною, оновлення, видалення.
- **Suppliers Module**
  - Додавання, список, видалення.
- **Orders Module**
  - Створення замовлення, список замовлень.
- **Analytics Module**
  - Топ-3 товари, топ-3 клієнти, активність працівників.

## 6. Специфікація API
### 6.1 Авторизація
- `POST /api/register`  
  Реєстрація працівника (перевірка унікальності email).
- `POST /api/login`  
  Вхід за набором полів працівника.
- `POST /api/logout`  
  Повертає повідомлення про вихід.

### 6.2 Працівники
- `GET /api/employees` - отримати список працівників.
- `POST /api/deleteEmployee/<employee_id>` - видалити працівника за `id`.
- `POST /api/updateEmployee` - оновити дозволене поле працівника.
- `GET /api/sortEmployees?order=asc|desc` - сортування за ім'ям.

### 6.3 Клієнти
- `POST /api/addClient` - додати клієнта (унікальний email).
- `GET /api/getClients` - отримати список клієнтів.
- `GET /api/sortClients?order=asc|desc` - сортування клієнтів.
- `POST /api/deleteClient/<client_id>` - видалити клієнта за `id`.
- `POST /api/updateClient` - оновити поле клієнта.

### 6.4 Товари
- `POST /api/add_product` - додати товар (із перевіркою існування постачальника).
- `GET /api/products` - отримати список товарів.
- `POST /api/deleteProduct/<product_id>` - видалити товар за `id`.
- `POST /api/updateProduct` - оновити дозволене поле товару.
- `GET /api/sortByPrice?order=ASC|DESC` - сортування за ціною.

### 6.5 Постачальники
- `GET /api/suppliers` - отримати список постачальників.
- `POST /api/add-supplier` - додати постачальника.
- `DELETE /api/delete-supplier/<supplier_id>` - видалити постачальника.

### 6.6 Замовлення
- `POST /api/createOrder` - створити замовлення.
- `GET /api/getOrders` - отримати список замовлень.

### 6.7 Аналітика
- `GET /api/topProducts` - топ-3 товарів за кількістю замовлень.
- `GET /api/topClients` - топ-3 клієнтів за кількістю замовлень.
- `GET /api/employeeOrders` - кількість замовлень по працівниках.

## 7. Модель даних (концептуально)
- **Employees** (`id_Employee`, `First_name`, `Last_name`, `Phone_number`, `Email`, `Position`)
- **Clients** (`id_Client`, `First_name`, `Last_name`, `Phone_Number`, `Email`)
- **Suppliers** (`id_Supplier`, `Supplier_Name`, `Contact_Name`, `Phone_Number`, `Email`, `Geolocation`)
- **Products** (`id_Product`, `Product_Name`, `Category`, `Price`, `Info`, `Discount`, `Quantity`, `id_Supplier`)
- **Orders** (`id_Order`, `id_Client`, `id_Product`, `Total_Amount`, `Payment_Method`, `Quantity`, `id_Employee`)

Зв'язки:
- `Products.id_Supplier -> Suppliers.id_Supplier`
- `Orders.id_Client -> Clients.id_Client`
- `Orders.id_Product -> Products.id_Product`
- `Orders.id_Employee -> Employees.id_Employee`

## 8. Валідації та бізнес-обмеження
- Email працівника має бути унікальним.
- Email клієнта має бути унікальним.
- Товар можна додати лише для існуючого постачальника.
- Замовлення можна створити лише для існуючих клієнта, працівника і товару.
- Для `update` дозволений лише визначений список полів.

## 9. Нефункціональні вимоги
- **Продуктивність:** основні CRUD-операції мають виконуватися швидко в локальному середовищі.
- **Надійність:** API має повертати зрозумілі коди помилок (`4xx/5xx`) і повідомлення.
- **Сумісність:** підтримка сучасних браузерів для фронтенду.
- **Підтримуваність:** чіткий поділ на сторінки/скрипти фронтенду і endpoint-и бекенду.

## 10. Розгортання і запуск
- Запуск Flask-сервера командою `python main.py` (за умови встановлених залежностей).
- Бекенд працює на `localhost:5000`.
- HTML-сторінки відкриваються у браузері та взаємодіють з API.
- Необхідно мати доступну БД `MySQL` зі схемою `kafeteriy1`.

## 11. Відомі технічні обмеження
- Параметри підключення до БД жорстко задані в коді.
- Відсутня повноцінна сесійна/токен-авторизація та ролі доступу.
- Відсутнє централізоване логування та автотести.
- Частина endpoint-ів використовує `POST` для дій, де міг би бути `PUT/PATCH/DELETE`.

## 12. Рекомендовані покращення (backlog)
- Додати JWT/сесії та рольову модель доступу.
- Додати серверну валідацію формату email/телефону.
- Додати unit/integration тести для ключових endpoint-ів.
