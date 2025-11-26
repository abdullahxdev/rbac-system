# Backend Setup Instructions

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create Required Folders

```bash
# Create logs folder
mkdir logs
```

## Step 3: Seed the Database

```bash
npm run seed
```

This will create:
- Database tables
- Sample roles (Admin, Manager, HR, Employee)
- Permissions
- Resources
- Test users

## Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

Server will run on: `http://localhost:5000`

## Test Credentials

After seeding, use these credentials to login:

**Admin:**
- Username: `admin`
- Password: `Admin@123`

**Manager:**
- Username: `manager`
- Password: `Manager@123`

**HR:**
- Username: `hr`
- Password: `HR@123`

**Employee:**
- Username: `employee`
- Password: `Employee@123`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout

### Users
- GET `/api/users` - Get all users (requires read:users)
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create user (requires create:users)
- PUT `/api/users/:id` - Update user (requires update:users)
- DELETE `/api/users/:id` - Delete user (requires delete:users)

### Roles
- GET `/api/roles` - Get all roles
- GET `/api/roles/:id` - Get role by ID
- POST `/api/roles` - Create role
- PUT `/api/roles/:id` - Update role
- DELETE `/api/roles/:id` - Delete role

### Permissions
- GET `/api/permissions` - Get all permissions
- GET `/api/permissions/:id` - Get permission by ID
- POST `/api/permissions` - Create permission
- PUT `/api/permissions/:id` - Update permission
- DELETE `/api/permissions/:id` - Delete permission

### Resources
- GET `/api/resources` - Get all resources
- GET `/api/resources/:id` - Get resource by ID
- POST `/api/resources` - Create resource
- PUT `/api/resources/:id` - Update resource
- DELETE `/api/resources/:id` - Delete resource

### Audit Logs
- GET `/api/audit` - Get audit logs (with filters)
- GET `/api/audit/stats` - Get audit statistics

## Testing the API

You can test using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

## Troubleshooting

If you get errors:
1. Make sure Node.js is installed (v18+)
2. Delete `database.sqlite` and run `npm run seed` again
3. Check that port 5000 is not in use
4. Check `.env` file exists with correct settings