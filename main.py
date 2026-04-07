from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = 'secret_key'

def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="iluha",
        database="kafeteriy1"
    )
    return connection

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')
    email = data.get('email')
    position = data.get('position')

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM Employees WHERE Email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        connection.close()
        return jsonify({"message": "Цей email вже зареєстрований!"}), 400
    cursor.execute("""
        INSERT INTO Employees (First_name, Last_name, Phone_number, Email, Position)
        VALUES (%s, %s, %s, %s, %s)
    """, (first_name, last_name, phone_number, email, position))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Реєстрація успішна!", "success": True}), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')
    email = data.get('email')
    position = data.get('position')

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT * FROM Employees 
        WHERE First_name = %s AND Last_name = %s AND Phone_number = %s AND Email = %s AND Position = %s
    """, (first_name, last_name, phone_number, email, position))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    if user:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Невірні дані для входу!"}), 401

@app.route('/api/logout', methods=['POST'])
def logout_user():
    return jsonify({"message": "Ви вийшли з системи!"})

@app.route('/api/employees', methods=['GET'])
def get_employees():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id_Employee, First_name, Last_name, Phone_number, Email, Position FROM Employees")
    employees = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(employees)

@app.route('/api/deleteEmployee', methods=['POST'])
def delete_employee():
    data = request.json
    employee_id = data.get('id')
    if not employee_id:
        return jsonify({"message": "Не вказано ID працівника!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM Employees WHERE id_Employee = %s", (employee_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Працівника видалено успішно!"}), 200

@app.route('/api/updateEmployee', methods=['POST'])
def update_employee():
    data = request.json
    employee_id = data.get('id')
    field = data.get('field')
    value = data.get('value')
    if not employee_id or not field or not value:
        return jsonify({"message": "Не вказано ID, поле або нове значення!"}), 400
    allowed_fields = ["First_name", "Last_name", "Position", "Email", "Phone_number"]
    if field not in allowed_fields:
        return jsonify({"message": "Недопустиме поле для оновлення!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    query = f"UPDATE Employees SET {field} = %s WHERE id_Employee = %s"
    cursor.execute(query, (value, employee_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": f"Поле {field} успішно оновлено!"}), 200

@app.route('/api/sortEmployees', methods=['GET'])
def sort_employees():
    order = request.args.get('order', 'asc')
    connection = get_db_connection()
    cursor = connection.cursor()

    if order == 'desc':
        cursor.execute("SELECT * FROM Employees ORDER BY First_name DESC")
    else:
        cursor.execute("SELECT * FROM Employees ORDER BY First_name ASC")
    employees = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"employees": employees}), 200

@app.route('/api/addClient', methods=['POST'])
def add_client():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')
    email = data.get('email')

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM Clients WHERE Email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        connection.close()
        return jsonify({"message": "Цей email вже зареєстрований!"}), 400
    cursor.execute("""
        INSERT INTO Clients (First_name, Last_name, Email, Phone_Number)
        VALUES (%s, %s, %s, %s)
    """, (first_name, last_name, email, phone_number))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Клієнта додано успішно!"}), 201

@app.route('/api/getClients', methods=['GET'])
def get_clients():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id_Client, First_name, Last_name, Phone_Number, Email FROM Clients")
    clients = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(clients)

@app.route('/api/sortClients', methods=['GET'])
def sort_clients():
    order = request.args.get('order', 'asc')
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    if order == 'desc':
        cursor.execute("SELECT id_Client, First_name, Last_name, Phone_Number, Email FROM Clients ORDER BY First_name DESC")
    else:
        cursor.execute("SELECT id_Client, First_name, Last_name, Phone_Number, Email FROM Clients ORDER BY First_name ASC")
    clients = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(clients)

@app.route('/api/deleteClient', methods=['POST'])
def delete_client():
    data = request.json
    client_id = data.get('id')
    if not client_id:
        return jsonify({"message": "Не вказано ID клієнта!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM Clients WHERE id_Client = %s", (client_id,))
    if not cursor.fetchone():
        cursor.close()
        connection.close()
        return jsonify({"message": "Клієнта з таким ID не знайдено!"}), 404
    cursor.execute("DELETE FROM Clients WHERE id_Client = %s", (client_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Клієнта видалено успішно!"}), 200

@app.route('/api/updateClient', methods=['POST'])
def update_client():
    data = request.json
    client_id = data.get('id')
    field = data.get('field')
    value = data.get('value')
    if not client_id or not field or not value:
        return jsonify({"message": "Не вказано ID, поле або нове значення!"}), 400
    allowed_fields = ["First_name", "Last_name", "Email", "Phone_number"]
    if field not in allowed_fields:
        return jsonify({"message": "Недопустиме поле для оновлення!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    query = f"UPDATE Clients SET {field} = %s WHERE id_Client = %s"
    cursor.execute(query, (value, client_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": f"Поле {field} успішно оновлено!"}), 200

@app.route('/api/add_product', methods=['POST'])
def add_product():
    data = request.get_json()
    supplier_id = data['id_supplier']
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute('SELECT id_Supplier FROM Suppliers WHERE id_Supplier = %s', (supplier_id,))
    supplier = cursor.fetchone()
    if not supplier:
        cursor.close()
        connection.close()
        return jsonify({"message": "Постачальник з таким ID не знайдений! Введіть правильний ID постачальника."}), 400
    query = '''INSERT INTO Products (Product_Name, Category, Price, Info, Discount, Quantity, id_Supplier) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)'''
    values = (
        data['productName'],
        data['category'],
        data['price'],
        data['info'],
        data['discount'],
        data['quantity'],
        supplier_id
    )
    try:
        cursor.execute(query, values)
        connection.commit()
        return jsonify({"message": "Товар успішно додано!"})
    except Exception as e:
        return jsonify({"message": "Помилка при додаванні товару", "error": str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Products')
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(products)

@app.route('/api/deleteProduct', methods=['POST'])
def delete_product():
    data = request.json
    product_id = data.get('id')
    if not product_id:
        return jsonify({"message": "Не вказано ID товару!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM Products WHERE id_Product = %s", (product_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Товар видалено успішно!"})

@app.route('/api/updateProduct', methods=['POST'])
def update_product():
    data = request.json
    product_id = data.get('id')
    field = data.get('field')
    value = data.get('value')
    if not product_id or not field or not value:
        return jsonify({"message": "Не вказано ID, поле або нове значення!"}), 400
    allowed_fields = ["Product_Name", "Price", "Quantity", "Info", "Discount", "id_Supplier"]
    if field not in allowed_fields:
        return jsonify({"message": "Недопустиме поле для оновлення!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    query = f"UPDATE Products SET {field} = %s WHERE id_Product = %s"
    cursor.execute(query, (value, product_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Дані товару успішно оновлено!"}), 200

@app.route('/api/sortByPrice', methods=['GET'])
def sort_products_by_price():
    order = request.args.get('order', 'ASC')
    if order not in ['ASC', 'DESC']:
        return jsonify({"message": "Невірний параметр order!"}), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = f'SELECT * FROM Products ORDER BY Price {order}'
    cursor.execute(query)
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(products)

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id_Supplier, Supplier_Name, Contact_Name, Phone_Number, Email, Geolocation FROM Suppliers")
        suppliers = cursor.fetchall()
        return jsonify(suppliers)
    except Exception as e:
        return jsonify({"message": "Помилка отримання постачальників", "error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/add-supplier', methods=['POST'])
def add_supplier():
    data = request.get_json()
    connection = get_db_connection()
    cursor = connection.cursor()

    query = '''INSERT INTO Suppliers (Supplier_Name, Contact_Name, Phone_Number, Email, Geolocation) 
               VALUES (%s, %s, %s, %s, %s)'''
    values = (data['supplierName'], data['contactName'], data['phoneNumber'], data['email'], data['geolocation'])
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Постачальника успішно додано!"})

@app.route('/api/delete-supplier/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute('DELETE FROM Suppliers WHERE id_Supplier = %s', (supplier_id,))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Постачальника не знайдено"}), 404
        return jsonify({"message": "Постачальника успішно видалено!"}), 200
    except mysql.connector.Error as err:
        return jsonify({"error": f"Помилка при видаленні постачальника: {err}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/createOrder', methods=['POST'])
def create_order():
    data = request.get_json()
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM Clients WHERE id_Client = %s', (data['idClient'],))
    client = cursor.fetchone()
    cursor.execute('SELECT * FROM Employees WHERE id_Employee = %s', (data['idEmployee'],))
    employee = cursor.fetchone()
    cursor.execute('SELECT * FROM Products WHERE id_Product = %s', (data['idProduct'],))
    product = cursor.fetchone()
    if not client or not employee or not product:
        return jsonify({"message": "Клієнт, працівник або продукт не знайдені"}), 400
    cursor.execute('''
        INSERT INTO Orders (id_Client, id_Product, Total_Amount, Payment_Method, Quantity, id_Employee)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (data['idClient'], data['idProduct'], data['totalAmount'], data['paymentMethod'], data['quantity'], data['idEmployee']))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Замовлення успішно створене"}), 200

@app.route('/api/getOrders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders")
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(orders)

@app.route('/api/topProducts', methods=['GET'])
def top_products():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = '''
        SELECT p.Product_Name, COUNT(o.id_Product) AS OrderCount
        FROM Products p
        JOIN Orders o ON p.id_Product = o.id_Product
        GROUP BY p.id_Product
        ORDER BY OrderCount DESC
        LIMIT 3
    '''
    cursor.execute(query)
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(products)

@app.route('/api/topClients', methods=['GET'])
def top_clients():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = '''
        SELECT c.First_name, c.Last_name, COUNT(o.id_Client) AS OrderCount
        FROM Clients c
        JOIN Orders o ON c.id_Client = o.id_Client
        GROUP BY c.id_Client
        ORDER BY OrderCount DESC
        LIMIT 3
    '''
    cursor.execute(query)
    clients = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(clients)

@app.route('/api/employeeOrders', methods=['GET'])
def employee_orders():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = '''
        SELECT e.First_name, e.Last_name, COUNT(o.id_Order) AS OrderCount
        FROM Employees e
        LEFT JOIN Orders o ON e.id_Employee = o.id_Employee
        GROUP BY e.id_Employee
        ORDER BY OrderCount DESC
    '''
    cursor.execute(query)
    employees = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(employees)

if __name__ == '__main__':
    app.run(debug=True)