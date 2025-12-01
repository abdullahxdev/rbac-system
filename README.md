# 🔐 RBAC System - Role-Based Access Control

**Information Security Course Project**

A full-stack web-based Role-Based Access Control (RBAC) system demonstrating enterprise-grade security principles including authentication, authorization, audit logging, and permission management.

---

## 🎯 Project Objectives

This project implements a complete RBAC system to demonstrate:

1. ✅ **Authentication** - JWT-based secure login system
2. ✅ **Authorization** - Permission-based access control
3. ✅ **User Management** - CRUD operations for users
4. ✅ **Role Management** - Define and assign roles
5. ✅ **Permission Management** - Granular access control
6. ✅ **Audit Logging** - Track all system activities
7. ✅ **Security Best Practices** - Password hashing, token management, CORS protection

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (React Frontend - Port 5173)                               │
│  • Login Page          • Dashboard       • User Management  │
│  • Role Management     • Permissions     • Audit Logs       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS + JWT
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      API Layer                               │
│  (Express.js Backend - Port 5000)                           │
│  • Authentication Routes    • Authorization Middleware      │
│  • User Routes             • Role Routes                    │
│  • Permission Routes       • Audit Routes                   │
└────────────────────────┬────────────────────────────────────┘
                         │ Sequelize ORM
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Database Layer                            │
│  (SQLite)                                                    │
│  • Users Table         • Roles Table                        │
│  • Permissions Table   • Resources Table                    │
│  • AuditLogs Table     • Junction Tables                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18.2 | Web framework |
| SQLite3 | 5.1.6 | Database |
| Sequelize | 6.35.2 | ORM |
| bcrypt | 5.1.1 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication |
| Winston | 3.11.0 | Logging |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| React Router | 6.20.0 | Routing |
| Axios | 1.6.2 | HTTP client |
| Tailwind CSS | 3.3.6 | Styling |
| Lucide React | 0.263.1 | Icons |
| Vite | 5.0.8 | Build tool |

---

## 📁 Project Structure

```
rbac-system/
├── backend/                    # Node.js + Express backend
│   ├── config/                # Database configuration
│   ├── models/                # Sequelize models
│   │   ├── User.js           # User model
│   │   ├── Role.js           # Role model
│   │   ├── Permission.js     # Permission model
│   │   ├── Resource.js       # Resource model
│   │   ├── AuditLog.js       # Audit log model
│   │   └── index.js          # Model relationships
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User CRUD routes
│   │   ├── roles.js          # Role CRUD routes
│   │   ├── permissions.js    # Permission CRUD routes
│   │   ├── resources.js      # Resource CRUD routes
│   │   └── audit.js          # Audit log routes
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication & authorization
│   │   └── auditLogger.js    # Audit logging
│   ├── utils/                 # Utilities
│   │   ├── logger.js         # Winston logger
│   │   └── seed.js           # Database seeding
│   ├── logs/                  # Application logs
│   ├── .env                   # Environment variables
│   ├── server.js             # Entry point
│   └── package.json          # Dependencies
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout.jsx    # Layout wrapper
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── PrivateRoute.jsx  # Route protection
│   │   │   └── LoadingSpinner.jsx # Loading states
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx     # Login page
│   │   │   ├── Dashboard.jsx # Dashboard
│   │   │   ├── Users.jsx     # User management
│   │   │   ├── Roles.jsx     # Role management
│   │   │   ├── Permissions.jsx   # Permission management
│   │   │   └── AuditLogs.jsx # Audit log viewer
│   │   ├── utils/            # Utilities
│   │   │   └── api.js        # API client
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite config
│   ├── tailwind.config.js    # Tailwind config
│   └── package.json          # Dependencies
│
├── docs/                      # Documentation
│   ├── BACKEND_DETAILED_DOCUMENTATION.md
│   ├── FRONTEND_README.md
│   ├── POSTMAN_TESTING_GUIDE.md
│   └── INFORMATION_SECURITY_CONCEPTS.md
│
└── README.md                  # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have installed:
- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **npm** (comes with Node.js)
- ✅ **Git** (optional, for cloning)
- ✅ **VS Code** or any code editor

---

### Installation Steps

#### **Step 1: Clone or Download Project**

```bash
# If using Git
git clone <repository-url>
cd rbac-system

# Or download ZIP and extract
```

---

#### **Step 2: Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with these contents:
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
DB_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:5173

# Seed the database (creates tables, users, roles, permissions)
npm run seed

# Start backend server
npm run dev
```

**Expected output:**
```
🚀 Starting RBAC Server...
📦 Connecting to database...
✅ Database connection established
✅ Database synchronized
✅ Server running on http://localhost:5000
```

---

#### **Step 3: Frontend Setup**

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

#### **Step 4: Access the Application**

1. Open browser and go to: **http://localhost:5173**
2. You should see the login page
3. Use test credentials to login

---

## 🔐 Test Credentials

After seeding the database, use these credentials:

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin` | `Admin@123` | All permissions (full system access) |
| **Manager** | `manager` | `Manager@123` | Read users, roles, audit logs, reports |
| **HR** | `hruser` | `HR@123` | Create/read/update users |
| **Employee** | `employee` | `Employee@123` | Read own profile, dashboard |

---

## 🎨 Features

### 1. **Authentication System**
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Token expiration (7 days)
- ✅ Automatic logout on token expiry
- ✅ Session management

### 2. **User Management**
- ✅ View all users (with pagination)
- ✅ Create new users
- ✅ Edit user details
- ✅ Assign/remove roles
- ✅ Activate/deactivate accounts
- ✅ Delete users (with confirmation)

### 3. **Role Management**
- ✅ View all roles
- ✅ Create custom roles
- ✅ Assign permissions to roles
- ✅ Role hierarchy (level system)
- ✅ Edit role details
- ✅ Delete roles

### 4. **Permission Management**
- ✅ View all permissions
- ✅ Create granular permissions (action:resource)
- ✅ Edit permission details
- ✅ Delete permissions
- ✅ Permission categories

### 5. **Audit Logging**
- ✅ Track all user actions
- ✅ Record login attempts
- ✅ Log CRUD operations
- ✅ Filter by action, status, date
- ✅ View statistics (success/failed/denied)
- ✅ Export capabilities (future)

### 6. **Dashboard**
- ✅ System statistics overview
- ✅ User profile information
- ✅ Permission list for current user
- ✅ Recent activity (future)

---

## 🔒 Security Features

### 1. **Authentication Security**
- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Signed and expiring tokens
- **Token Storage:** localStorage (httpOnly cookies in production)
- **Session Management:** Stateless authentication

### 2. **Authorization Security**
- **RBAC Model:** Users → Roles → Permissions
- **Least Privilege:** Users get minimum necessary permissions
- **Route Protection:** Backend middleware enforcement
- **UI Protection:** Frontend permission checks

### 3. **Data Security**
- **SQL Injection Prevention:** Sequelize parameterized queries
- **XSS Prevention:** React auto-escaping
- **CSRF Protection:** JWT (not cookies)
- **CORS Protection:** Whitelisted origins

### 4. **Audit & Monitoring**
- **Complete Audit Trail:** All actions logged
- **User Attribution:** Track who did what
- **Timestamp Tracking:** When actions occurred
- **IP Logging:** Where actions came from

---

## 📊 Database Schema

### ER Diagram

```
Users ←──┐
    │    │
    │    ├──→ UserRoles ←──┐
    │    │                  │
    │    │              Roles ←──┐
    │    │                  │    │
    │    │                  │    ├──→ RolePermissions
    │    │                  │    │
    │    │                  │    │
    │    └──→ AuditLogs     │    │
                            │    │
                       Permissions ←──┐
                            │         │
                            └──→ Resources
```

### Tables

1. **Users:** User accounts
2. **Roles:** Role definitions
3. **Permissions:** Permission definitions
4. **Resources:** Protected resources
5. **AuditLogs:** Activity logs
6. **UserRoles:** Users-to-Roles junction
7. **RolePermissions:** Roles-to-Permissions junction

---

## 🧪 Testing

### Manual Testing

1. **Authentication Testing:**
   - ✅ Login with valid credentials
   - ✅ Login with invalid credentials
   - ✅ Logout functionality
   - ✅ Token expiration

2. **Authorization Testing:**
   - ✅ Admin can access all features
   - ✅ Manager has limited access
   - ✅ Employee has minimal access
   - ✅ Direct URL access blocked

3. **CRUD Testing:**
   - ✅ Create/Read/Update/Delete users
   - ✅ Create/Read/Update/Delete roles
   - ✅ Create/Read/Update/Delete permissions
   - ✅ Audit logs generated

### Postman Testing

See [POSTMAN_TESTING_GUIDE.md](./docs/POSTMAN_TESTING_GUIDE.md) for complete API testing guide.

---

## 📚 Documentation

Detailed documentation available in `docs/` folder:

1. **[BACKEND_DETAILED_DOCUMENTATION.md](./docs/BACKEND_DETAILED_DOCUMENTATION.md)**  
   Complete backend architecture, code explanations, security concepts

2. **[FRONTEND_README.md](./docs/FRONTEND_README.md)**  
   Frontend structure, components, styling, API integration

3. **[POSTMAN_TESTING_GUIDE.md](./docs/POSTMAN_TESTING_GUIDE.md)**  
   API testing guide with Postman examples

4. **[INFORMATION_SECURITY_CONCEPTS.md](./docs/INFORMATION_SECURITY_CONCEPTS.md)**  
   Security principles, threats, and mitigations

---

## 🔧 Configuration

### Backend (.env)

```bash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
DB_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:5173
```

### Frontend (vite.config.js)

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🐛 Troubleshooting

### Backend won't start

**Check:**
- Node.js installed (`node --version`)
- All dependencies installed (`npm install`)
- `.env` file exists
- Port 5000 not in use

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run dev
```

---

### Frontend won't start

**Check:**
- Backend is running first
- All dependencies installed
- Port 5173 available

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Can't login

**Check:**
- Backend running on port 5000
- Database seeded (`npm run seed`)
- Using correct credentials
- Check browser console for errors (F12)

**Test backend:**
```bash
# Open browser and go to:
http://localhost:5000/api/health

# Should return: {"status":"ok","message":"RBAC System is running"}
```

---

### CORS errors

**Check backend .env:**
```
CORS_ORIGIN=http://localhost:5173
```

**Restart backend:**
```bash
npm run dev
```

---

## 📈 Information Security Concepts Demonstrated

### 1. **CIA Triad**
- **Confidentiality:** Password hashing, JWT encryption
- **Integrity:** Permission checks, audit logs
- **Availability:** Error handling, graceful degradation

### 2. **Authentication**
- Username/password verification
- JWT token generation
- Session management

### 3. **Authorization**
- Role-Based Access Control (RBAC)
- Permission-based resource access
- Least privilege principle

### 4. **Accountability**
- Complete audit trail
- User action tracking
- Forensic capabilities

### 5. **Defense in Depth**
- Multiple security layers
- Backend + Frontend enforcement
- Input validation at all levels

---

## 🎓 Project Report Sections

When writing your project report, include:

### 1. Introduction
- Problem statement
- Project objectives
- Significance of RBAC

### 2. Literature Review
- NIST RBAC standard
- Existing RBAC systems
- Identified gaps

### 3. Methodology
- System architecture
- Technology choices
- Development approach

### 4. Implementation
- Backend implementation
- Frontend implementation
- Database design

### 5. Security Analysis
- Threat model
- Security features
- Vulnerabilities addressed

### 6. Testing & Results
- Test cases
- Screenshots
- Performance metrics

### 7. Conclusion
- Achievements
- Lessons learned
- Future work

---

## 📸 Screenshots to Include

1. ✅ Login page
2. ✅ Dashboard
3. ✅ User management
4. ✅ Role management
5. ✅ Permission management
6. ✅ Audit logs
7. ✅ Access denied page
8. ✅ User creation modal
9. ✅ Postman API testing
10. ✅ Database schema

---

## 🚀 Future Enhancements

### Security Enhancements
- [ ] Multi-Factor Authentication (MFA)
- [ ] Password complexity requirements
- [ ] Account lockout after failed attempts
- [ ] Password history
- [ ] Session timeout warnings

### Feature Enhancements
- [ ] Advanced filtering and search
- [ ] Data export (CSV, PDF)
- [ ] User profile page
- [ ] Activity dashboard
- [ ] Real-time notifications
- [ ] Dark/Light theme toggle
- [ ] Internationalization (i18n)

### Technical Enhancements
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Production deployment guide

---

## 📄 References

1. **NIST RBAC Standard:**  
   https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=916402

2. **OWASP Authorization Cheat Sheet:**  
   https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html

3. **Cryptography & Network Security (8th Edition)**  
   William Stallings

4. **React Documentation:**  
   https://react.dev

5. **Express.js Guide:**  
   https://expressjs.com

---

## 📝 License

This project is submitted as part of the Information Security course requirements at COMSATS University.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@abdullahxdev](https://github.com/abdullahxdev)
- LinkedIn: [Muhammad Abdullah](https://linkedin.com/in/mabdullahxdev)
- Email: abdullahisdev@gmail.com

---

## 🙏 Acknowledgments

- **Sir SaifUllah Ijaz** - Course Instructor
- **COMSATS University** - Department of Computer Science
- **NIST** - RBAC Standard Reference
- **OWASP** - Security Guidelines

---

**Built with ❤️ for Information Security Course - Fall 2025**

---

## 🎉 Congratulations!

You've successfully built a production-grade RBAC system demonstrating enterprise-level security practices! 🔐✨