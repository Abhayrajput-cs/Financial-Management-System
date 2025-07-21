# Financial Management System

A comprehensive financial management application built with React (frontend) and Spring Boot with JDBC (backend).

## Features

### 🔐 User Authentication
- User registration with validation
- JWT-based login/logout
- Secure session management

### 📊 Dashboard
- Overview of total income, expenses, and current balance
- Daily/weekly/monthly summaries
- Interactive charts and graphs

### 💰 Income Management
- Add, view, edit, and delete income entries
- Track income sources and dates
- Income history with filtering

### 💸 Expense Management
- Add, view, edit, and delete expense entries
- Categorize expenses
- Filter by date and category

### 📈 Analytics
- Pie charts for expense distribution by category
- Line graphs for income vs expenses over time
- Monthly and yearly financial reports

## Tech Stack

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **JWT Decode** for token management

### Backend
- **Spring Boot** 3.2.0
- **Spring Security** with JWT
- **JDBC** for database operations
- **MySQL** database
- **Maven** for dependency management

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

### Prerequisites
- Node.js (v18 or higher)
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Database Setup
1. Install MySQL and create a database named `financial_management_db`
2. Update database credentials in `backend/src/main/resources/application.properties`
3. Run the schema.sql file to create tables

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

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

## Development Status

This project is currently under development. Check the task list for current progress and upcoming features.

## License

This project is licensed under the MIT License.
