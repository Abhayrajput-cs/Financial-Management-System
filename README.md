# 💰 Financial Management System

A comprehensive full-stack financial management application built with React (frontend) and Spring Boot with JDBC (backend). Features real-time currency conversion, expense tracking, income management, and detailed analytics with persistent MySQL storage.

## 🌟 Features

### 🔐 **User Authentication**
- Secure user registration with validation
- JWT-based login/logout system
- Password encryption with BCrypt
- Protected routes and API endpoints
- Session management with automatic token refresh

### 📊 **Dashboard & Analytics**
- Comprehensive overview of financial status
- Real-time balance calculations (income - expenses)
- Interactive charts and graphs using Chart.js
- Daily, weekly, monthly, and yearly summaries
- Visual expense distribution by category
- Income vs expense trend analysis

### 💰 **Income Management**
- Add, view, edit, and delete income entries
- Multiple income source tracking
- Date-based income filtering
- Detailed income history with search
- Income categorization and descriptions

### 💸 **Expense Management**
- Complete expense tracking system
- 15+ predefined categories (Food & Dining, Transportation, etc.)
- Custom expense descriptions and notes
- Date range filtering and sorting
- Inline editing and deletion
- Expense statistics and totals

### 🌍 **Currency Conversion**
- Real-time currency conversion
- Support for major world currencies (USD, EUR, GBP, INR, etc.)
- Live exchange rate integration
- Convert amounts on-the-fly
- Multi-currency display options

### 💾 **Data Persistence**
- MySQL database for permanent storage
- User-specific data isolation
- Automatic timestamps for all records
- Data integrity with foreign key constraints
- Backup and recovery support

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Chart.js** - Beautiful data visualization and charts
- **CSS3** - Custom styling and responsive design
- **JWT Decode** - Token management and authentication

### **Backend**
- **Java 23** - Latest Java version
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JDBC** - Database access layer
- **JWT** - JSON Web Token for secure authentication
- **BCrypt** - Password hashing and encryption
- **Maven** - Dependency management and build tool

### **Database & Infrastructure**
- **MySQL 8.0** - Relational database management
- **XAMPP** - Local development environment
- **phpMyAdmin** - Database administration interface

### **External APIs**
- **Exchange Rate API** - Real-time currency conversion rates

## Project Structure

```
financial-management-system/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
├── backend/                 # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/financialmanagement/
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # Data access layer
│   │   │   │   ├── model/         # Entity models
│   │   │   │   ├── config/        # Configuration classes
│   │   │   │   └── security/      # Security configuration
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/
│   └── pom.xml
└── README.md
```

## Getting Started

### **Prerequisites**
- **Node.js 18+** - JavaScript runtime
- **Java 23+** - Programming language
- **Maven 3.6+** - Build automation tool
- **MySQL 8.0+** - Database server
- **XAMPP** - Recommended for local MySQL setup

### **Installation Steps**

#### **1. Clone Repository**
```bash
git clone <repository-url>
cd financial-management-system
```

#### **2. Database Setup**
1. **Start XAMPP** and enable MySQL service
2. **Open phpMyAdmin**: http://localhost/phpmyadmin
3. **Create database**: `financial_management_db`
4. **Tables auto-created** on first application run

#### **3. Backend Setup**
```bash
cd backend
# Set Java Home (Windows)
$env:JAVA_HOME="C:\Program Files\Java\jdk-23"
# Clean and compile
.\mvnw.cmd clean compile
# Start the backend server
.\mvnw.cmd spring-boot:run
```

#### **4. Frontend Setup**
```bash
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev
```

#### **5. Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database Admin**: http://localhost/phpmyadmin

### **Default Login Credentials**
- **Email**: `abcd@gmail.com`
- **Password**: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Income Management
- `POST /api/income` - Add income
- `GET /api/income` - Get all incomes
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

### Expense Management
- `POST /api/expense` - Add expense
- `GET /api/expense` - Get all expenses
- `PUT /api/expense/{id}` - Update expense
- `DELETE /api/expense/{id}` - Delete expense

### Analytics
- `GET /api/analytics/monthly-summary` - Monthly income vs expense
- `GET /api/analytics/category-breakdown` - Expense by category
- `GET /api/analytics/overall-summary` - Total income, expenses, balance

## 🔧 Configuration

### **Backend Configuration (application.properties)**
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/financial_management_db
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

### **Frontend Configuration**
```javascript
// API Base URL (src/services/api.js)
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Expenses Table**
```sql
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### **Income Table**
```sql
CREATE TABLE incomes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Usage Guide

### **1. User Registration & Login**
1. Navigate to `/signup` to create a new account
2. Use `/login` to access existing account
3. JWT token automatically manages authentication

### **2. Managing Expenses**
1. **Add Expense**: Go to `/add-expense`
2. **View Expenses**: Visit `/expenses` to see all entries
3. **Edit/Delete**: Use inline buttons on expense cards
4. **Filter**: Use date range and category filters

### **3. Managing Income**
1. **Add Income**: Navigate to `/add-income`
2. **View Income**: Check `/income` for all entries
3. **Track Sources**: Multiple income sources supported

### **4. Analytics & Dashboard**
1. **Dashboard**: Visit `/dashboard` for overview
2. **Charts**: Visual representation of financial data
3. **Reports**: Monthly and yearly summaries

### **5. Currency Conversion**
1. **Select Currency**: Use currency dropdown in UI
2. **Real-time Rates**: Automatic conversion with live rates
3. **Multiple Currencies**: Support for USD, EUR, GBP, INR, etc.

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - BCrypt hashing for passwords
- **Protected Routes** - Frontend route protection
- **API Security** - Backend endpoint protection
- **CORS Configuration** - Cross-origin request handling
- **Input Validation** - Server-side data validation

## 📱 Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Tablet Support** - Responsive layout for tablets
- **Desktop Experience** - Full-featured desktop interface
- **Cross-Browser** - Compatible with modern browsers

## 🔍 Troubleshooting

### **Common Issues**

#### **Backend Won't Start**
- Ensure MySQL is running via XAMPP
- Check Java version (requires Java 23+)
- Verify database connection in application.properties

#### **Frontend Shows Blank Page**
- Check if backend is running on port 8080
- Verify API calls in browser console (F12)
- Ensure authentication token is present

#### **Database Connection Error**
- Start MySQL service in XAMPP Control Panel
- Create `financial_management_db` database
- Check database credentials

#### **Authentication Issues**
- Clear browser localStorage
- Re-login with valid credentials
- Check JWT token expiration

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Financial Management System**
- **Email**: abcd@gmail.com
- **Demo User**: Login with above credentials to test the application

## 🙏 Acknowledgments

- **Spring Boot** team for the excellent framework
- **React** team for the powerful UI library
- **Chart.js** for beautiful data visualization
- **MySQL** for reliable data storage
- **Vite** for fast development experience

---

**Happy Financial Management! 💰📊✨**
