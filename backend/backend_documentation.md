# 🔐 Backend Detailed Documentation - RBAC System

## 📁 Project Structure Overview

```
backend/
├── config/          # Configuration files (database setup)
├── models/          # Database models (User, Role, Permission, etc.)
├── routes/          # API endpoint definitions
├── middleware/      # Security & logging middleware
├── utils/           # Helper functions (logger, seed script)
├── logs/            # Application logs (auto-generated)
├── .env             # Environment variables (secrets)
├── server.js        # Main application entry point
├── package.json     # Dependencies & scripts
└── database.sqlite  # SQLite database file (auto-generated)
```

---

## 📂 Folder-by-Folder Breakdown

### 1️⃣ `config/` - Configuration Files

**Purpose:** Stores configuration for database connections and other app settings.

#### **File: `database.js`**
**What it does:** Establishes connection to SQLite database using Sequelize ORM.

**Key Concepts:**
- **Sequelize:** An ORM (Object-Relational Mapping) tool that lets you interact with databases using JavaScript objects instead of raw SQL
- **SQLite:** A lightweight, file-based database (no separate server needed)

**Code Breakdown:**
```javascript
export const sequelize = new Sequelize({
  dialect: 'sqlite',              // Database type
  storage: './database.sqlite',   // Where to store the DB file
  logging: false,                 // Don't show SQL queries in console
});
```

**Security Concept:** Database credentials stored in `.env` file (not hardcoded).

---

### 2️⃣ `models/` - Database Schema Definitions

**Purpose:** Defines the structure of your database tables and relationships.

#### **File: `User.js`**
**What it does:** Defines the User table structure and password hashing.

**Key Security Concepts:**
- **Password Hashing:** Passwords are NEVER stored in plain text. They're hashed using `bcrypt`.
- **Hooks:** Automatically hash password before saving to database.
- **Salt:** Random data added to password before hashing (prevents rainbow table attacks).

**Code Breakdown:**
```javascript
// Define User table columns
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },  // Will be hashed
  isActive: { type: DataTypes.BOOLEAN }
});

// Automatic password hashing before saving
hooks: {
  beforeCreate: async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
}

// Method to compare passwords during login
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

**Why this matters:** Even if someone steals your database, they can't read passwords!

---

#### **File: `Role.js`**
**What it does:** Defines roles (Admin, Manager, HR, Employee).

**Key RBAC Concept:** Roles group users together. Instead of giving permissions to each user individually, you assign them a role.

**Code Breakdown:**
```javascript
const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, unique: true },  // "Admin", "Manager"
  description: { type: DataTypes.TEXT },
  level: { type: DataTypes.INTEGER }  // Hierarchy (100=highest)
});
```

---

#### **File: `Permission.js`**
**What it does:** Defines what actions can be performed on resources.

**Key RBAC Concept:** Permissions are atomic actions like "create:users" or "read:audit".

**Code Breakdown:**
```javascript
const Permission = sequelize.define('Permission', {
  name: { type: DataTypes.STRING },      // "create:users"
  action: { type: DataTypes.STRING },    // "create", "read", "update", "delete"
  resource: { type: DataTypes.STRING },  // "users", "roles"
  description: { type: DataTypes.TEXT }
});
```

**Example:** Permission `create:users` means "allowed to create new users".

---

#### **File: `Resource.js`**
**What it does:** Represents protected resources (endpoints, pages, files).

**Code Breakdown:**
```javascript
const Resource = sequelize.define('Resource', {
  name: { type: DataTypes.STRING },    // "users"
  type: { type: DataTypes.STRING },    // "endpoint", "page"
  path: { type: DataTypes.STRING },    // "/api/users"
  isActive: { type: DataTypes.BOOLEAN }
});
```

---

#### **File: `AuditLog.js`**
**What it does:** Records every action in the system for security monitoring.

**Key Security Concept:** Audit logging helps detect:
- Unauthorized access attempts
- Suspicious user behavior
- Compliance violations

**Code Breakdown:**
```javascript
const AuditLog = sequelize.define('AuditLog', {
  userId: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING },    // "login", "delete_user"
  resource: { type: DataTypes.STRING },  // "users"
  status: { type: DataTypes.STRING },    // "success", "failed", "denied"
  ipAddress: { type: DataTypes.STRING },
  timestamp: { type: DataTypes.DATE }
});
```

**Why this matters:** If someone deletes important data, you can trace WHO did it and WHEN.

---

#### **File: `index.js`**
**What it does:** Defines relationships between models (Many-to-Many, One-to-Many).

**Key Database Concept:** Relationships connect tables together.

**Code Breakdown:**
```javascript
// Many-to-Many: A user can have multiple roles, a role can have multiple users
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// Many-to-Many: A role can have many permissions, a permission can belong to many roles
Role.belongsToMany(Permission, { through: 'RolePermissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions' });
```

**Result:** Creates junction tables: `UserRoles` and `RolePermissions`.

---

### 3️⃣ `middleware/` - Security & Request Processing

**Purpose:** Code that runs BETWEEN receiving a request and sending a response.

#### **File: `auth.js`**
**What it does:** Verifies JWT tokens and checks permissions.

**Key Security Concepts:**
- **Authentication:** "Who are you?" (verify JWT token)
- **Authorization:** "What can you do?" (check permissions)
- **JWT (JSON Web Token):** Encrypted token that proves user identity

**Code Breakdown:**

**1. `authenticate` Middleware:**
```javascript
export const authenticate = async (req, res, next) => {
  // Extract token from "Authorization: Bearer TOKEN" header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token signature using JWT_SECRET
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Find user from database
  const user = await User.findByPk(decoded.id, {
    include: roles and permissions  // Load user's roles & permissions
  });

  req.user = user;  // Attach user to request object
  next();           // Continue to next middleware/route
};
```

**How it works:**
1. Client sends: `Authorization: Bearer eyJhbGciOiJIUz...`
2. Server verifies token is valid and not expired
3. Loads user's roles and permissions
4. Attaches user to `req.user` for later use

---

**2. `authorize` Middleware:**
```javascript
export const authorize = (...requiredPermissions) => {
  return async (req, res, next) => {
    // Get all user's permissions from all their roles
    const userPermissions = [];
    req.user.roles.forEach(role => {
      role.permissions.forEach(perm => {
        userPermissions.push(`${perm.action}:${perm.resource}`);
      });
    });

    // Check if user has ALL required permissions
    const hasPermission = requiredPermissions.every(perm => 
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();  // User has permission, proceed
  };
};
```

**Example Usage:**
```javascript
// Only users with "create:users" permission can access this route
router.post('/users', authenticate, authorize('create:users'), createUser);
```

---

**3. `requireRole` Middleware:**
```javascript
export const requireRole = (...roles) => {
  return async (req, res, next) => {
    const userRoles = req.user.roles.map(role => role.name);
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Insufficient role' });
    }

    next();
  };
};
```

**Example Usage:**
```javascript
// Only Admins and Managers can access
router.get('/reports', authenticate, requireRole('Admin', 'Manager'), getReports);
```

---

#### **File: `auditLogger.js`**
**What it does:** Automatically logs every action to the database.

**Key Security Concept:** Creates an immutable audit trail.

**Code Breakdown:**
```javascript
export const logAudit = (action, resource) => {
  return async (req, res, next) => {
    // Intercept the response to know if it succeeded or failed
    const originalSend = res.send;
    
    res.send = function(data) {
      const status = res.statusCode >= 200 && res.statusCode < 300 
        ? 'success' 
        : 'failed';
      
      // Create audit log entry
      AuditLog.create({
        userId: req.user ? req.user.id : null,
        action: action,              // "create_user"
        resource: resource,          // "users"
        status: status,              // "success" or "failed"
        ipAddress: req.ip,
        timestamp: new Date()
      });

      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

**Why this matters:** Every action is recorded with timestamp, user, and outcome.

---

### 4️⃣ `routes/` - API Endpoint Definitions

**Purpose:** Defines URLs that clients can call and what they do.

#### **File: `auth.js`**
**What it does:** Handles login, registration, and authentication.

**Key Endpoints:**

**1. POST `/api/auth/register`** - Create new user
```javascript
router.post('/register', async (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ message: 'User exists' });
  }

  // Create user (password automatically hashed by User model hook)
  const user = await User.create({ username, email, password, fullName });
  
  // Assign default "Employee" role
  const employeeRole = await Role.findOne({ where: { name: 'Employee' } });
  await user.addRole(employeeRole);

  res.status(201).json({ message: 'User registered', user });
});
```

---

**2. POST `/api/auth/login`** - Authenticate user
```javascript
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user with roles & permissions
  const user = await User.findOne({
    where: { username },
    include: [{ model: Role, include: [Permission] }]
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare provided password with hashed password in DB
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({ message: 'Account inactive' });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },  // Payload
    process.env.JWT_SECRET,                    // Secret key
    { expiresIn: '7d' }                        // Expires in 7 days
  );

  res.json({ success: true, token, user });
});
```

**How JWT Works:**
1. User logs in with username/password
2. Server verifies credentials
3. Server creates JWT token: `{ id: 123, username: "admin" }` + signature
4. Client stores token (localStorage/cookie)
5. Client sends token with every request: `Authorization: Bearer TOKEN`
6. Server verifies token signature to confirm it's authentic

---

#### **File: `users.js`**
**What it does:** CRUD operations for users.

**Key Endpoints:**

**GET `/api/users`** - List all users (requires `read:users` permission)
```javascript
router.get('/', 
  authenticate,              // Must be logged in
  authorize('read:users'),   // Must have permission
  async (req, res) => {
    const users = await User.findAll({
      include: [{ model: Role }],
      attributes: { exclude: ['password'] }  // Don't send passwords!
    });
    res.json({ success: true, users });
  }
);
```

**POST `/api/users`** - Create new user (requires `create:users`)
**PUT `/api/users/:id`** - Update user (requires `update:users`)
**DELETE `/api/users/:id`** - Delete user (requires `delete:users`)

---

#### **File: `roles.js`**
**What it does:** Manage roles and their permissions.

**Example:**
```javascript
router.post('/', authenticate, authorize('create:roles'), async (req, res) => {
  const { name, description, level, permissionIds } = req.body;
  
  // Create role
  const role = await Role.create({ name, description, level });
  
  // Assign permissions to role
  if (permissionIds?.length > 0) {
    const permissions = await Permission.findAll({ 
      where: { id: permissionIds } 
    });
    await role.addPermissions(permissions);
  }
  
  res.status(201).json({ success: true, role });
});
```

---

#### **File: `permissions.js`**
**What it does:** Manage available permissions.

#### **File: `resources.js`**
**What it does:** Manage protected resources.

#### **File: `audit.js`**
**What it does:** View audit logs with filtering.

**Example:**
```javascript
router.get('/', authenticate, authorize('read:audit'), async (req, res) => {
  const { page = 1, limit = 50, action, status, userId } = req.query;
  
  // Build filter conditions
  const where = {};
  if (action) where.action = { [Op.like]: `%${action}%` };
  if (status) where.status = status;
  if (userId) where.userId = userId;

  // Fetch logs with pagination
  const logs = await AuditLog.findAll({
    where,
    include: [{ model: User, attributes: ['username'] }],
    order: [['timestamp', 'DESC']],
    limit: parseInt(limit),
    offset: (page - 1) * limit
  });

  res.json({ success: true, logs });
});
```

---

### 5️⃣ `utils/` - Helper Functions

#### **File: `logger.js`**
**What it does:** Logs application events to files using Winston.

**Code Breakdown:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',                    // Log everything at 'info' level and above
  format: winston.format.json(),    // Store logs as JSON
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}
```

**Usage:**
```javascript
logger.info('Server started on port 5000');
logger.error('Database connection failed', error);
```

---

#### **File: `seed.js`**
**What it does:** Populates database with initial data.

**What it creates:**
1. **Resources:** users, roles, permissions, audit, dashboard
2. **Permissions:** create:users, read:users, update:users, delete:users, etc.
3. **Roles:** Admin (all permissions), Manager (subset), HR (user management), Employee (basic)
4. **Users:** admin, manager, hruser, employee with hashed passwords
5. **Relationships:** Assigns permissions to roles, roles to users

**Run with:** `npm run seed`

---

### 6️⃣ Root Files

#### **File: `server.js`**
**What it does:** Main application entry point. Starts the Express server.

**Code Flow:**
```javascript
// 1. Load environment variables
dotenv.config();

// 2. Create Express app
const app = express();

// 3. Add middleware
app.use(cors());              // Allow frontend to connect
app.use(express.json());      // Parse JSON request bodies

// 4. Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// ... etc

// 5. Connect to database
await sequelize.authenticate();
await sequelize.sync();

// 6. Start server
app.listen(5000);
```

---

#### **File: `.env`**
**What it does:** Stores secret configuration (NEVER commit to GitHub!).

**Contents:**
```
PORT=5000
JWT_SECRET=my_secret_key_12345        # Secret for signing JWT tokens
JWT_EXPIRES_IN=7d                      # Tokens expire in 7 days
DB_PATH=./database.sqlite              # Database file location
CORS_ORIGIN=http://localhost:5173     # Allowed frontend origin
```

**Security Concept:** Environment variables keep secrets OUT of your code.

---

#### **File: `package.json`**
**What it does:** Lists dependencies and defines npm scripts.

**Key Dependencies:**
- `express` - Web framework
- `sequelize` - ORM for database
- `sqlite3` - Database driver
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token creation/verification
- `cors` - Cross-Origin Resource Sharing
- `winston` - Logging

**Scripts:**
- `npm start` - Run server
- `npm run dev` - Run with auto-reload (nodemon)
- `npm run seed` - Populate database

---

## 🔐 Key Security Concepts Used

### 1. **Password Hashing (bcrypt)**
- Passwords NEVER stored in plain text
- Uses salt to prevent rainbow table attacks
- One-way function (can't reverse)

### 2. **JWT Authentication**
- Stateless authentication (no server-side sessions)
- Token contains user ID + signature
- Signature prevents tampering
- Token expires after 7 days

### 3. **Role-Based Access Control (RBAC)**
- Users → Roles → Permissions
- Implements least privilege principle
- Easier to manage than individual permissions

### 4. **Audit Logging**
- Records WHO did WHAT and WHEN
- Immutable trail for compliance
- Detects unauthorized access

### 5. **Input Validation**
- `express-validator` checks user input
- Prevents SQL injection
- Prevents malformed data

### 6. **CORS Protection**
- Only allows requests from `http://localhost:5173`
- Prevents unauthorized websites from accessing API

### 7. **Error Handling**
- Never exposes stack traces to users
- Logs errors internally for debugging
- Returns generic error messages

---

## 🎯 Information Security Concepts Demonstrated

1. **Authentication** - Verify user identity (login)
2. **Authorization** - Control access to resources (RBAC)
3. **Confidentiality** - Data encryption (JWT, password hashing)
4. **Integrity** - Prevent unauthorized modifications (middleware checks)
5. **Availability** - System remains accessible to authorized users
6. **Accountability** - Audit logs track all actions
7. **Least Privilege** - Users get minimum necessary permissions
8. **Defense in Depth** - Multiple security layers (auth + authorization + logging)

---

## 📊 Database Schema

```
Users ←→ UserRoles ←→ Roles ←→ RolePermissions ←→ Permissions → Resources
   ↓
AuditLogs
```

**Relationships:**
- User can have many Roles (Many-to-Many)
- Role can have many Permissions (Many-to-Many)
- Permission belongs to one Resource (Many-to-One)
- AuditLog belongs to one User (Many-to-One)

---

## 🧪 Testing Flow

1. **Seed Database:** `npm run seed`
2. **Start Server:** `npm run dev`
3. **Test Login:** POST `/api/auth/login` with username/password
4. **Get Token:** Copy token from response
5. **Test Protected Route:** GET `/api/users` with `Authorization: Bearer TOKEN`
6. **Check Audit Logs:** GET `/api/audit` to see logged actions

---

This backend implements **enterprise-grade security** using industry-standard patterns! 🔒