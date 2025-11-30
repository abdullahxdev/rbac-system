# 🧪 Postman Testing Guide - RBAC System API

## 📥 Setup Postman

1. Download Postman: https://www.postman.com/downloads/
2. Install and open Postman
3. Create a new Collection called "RBAC System"

---

## 🔑 Test Credentials

After running `npm run seed`, you have these test users:

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| admin | Admin@123 | Admin | All permissions |
| manager | Manager@123 | Manager | Read users, roles, audit, reports |
| hruser | HR@123 | HR | Create/read/update users |
| employee | Employee@123 | Employee | Read own profile, dashboard |

---

## 📋 Complete API Test Suite

### ✅ **Test 1: Health Check (No Auth Required)**

**Purpose:** Verify server is running

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/health`
- **Headers:** None needed
- **Body:** None

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "message": "RBAC System is running"
}
```

---

### 🔐 **Test 2: Login as Admin**

**Purpose:** Get JWT authentication token

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwi...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@rbac.com",
    "fullName": "System Administrator",
    "isActive": true,
    "roles": [
      {
        "id": 1,
        "name": "Admin",
        "description": "Full system access"
      }
    ]
  }
}
```

**⚠️ IMPORTANT:** Copy the `token` value - you'll need it for all subsequent requests!

---

### 🔒 **Setting Up Authorization Header in Postman**

For all protected routes, you need to add the JWT token:

**Option 1: Add to each request manually**
1. Go to **Headers** tab
2. Add new header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`
   - ⚠️ Note the space after "Bearer"

**Option 2: Use Collection Variables (Recommended)**
1. Click on your "RBAC System" collection
2. Go to **Variables** tab
3. Add variable:
   - Variable: `token`
   - Initial Value: (paste your token)
   - Current Value: (paste your token)
4. In request headers, use: `Bearer {{token}}`

---

## 👥 User Management Tests

### **Test 3: Get All Users (Admin only)**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body:** None

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@rbac.com",
      "fullName": "System Administrator",
      "isActive": true,
      "roles": [...]
    },
    // ... more users
  ]
}
```

**Test Authorization:**
- ✅ Try with Admin token → Should succeed
- ❌ Try with Employee token → Should get 403 Forbidden

---

### **Test 4: Get Single User**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/users/1`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@rbac.com",
    "fullName": "System Administrator",
    "roles": [
      {
        "id": 1,
        "name": "Admin",
        "permissions": [...]
      }
    ]
  }
}
```

---

### **Test 5: Create New User (Admin only)**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "test@rbac.com",
  "password": "Test@123",
  "fullName": "Test User",
  "roleIds": [4]
}
```
*Note: `roleIds: [4]` assigns Employee role (check your DB for correct IDs)*

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 5,
    "username": "testuser",
    "email": "test@rbac.com",
    "fullName": "Test User",
    "roles": [...]
  }
}
```

**Error Cases to Test:**
- ❌ Duplicate username → 400 Bad Request
- ❌ Missing required fields → 400 Bad Request
- ❌ Employee token → 403 Forbidden

---

### **Test 6: Update User**

**Request:**
- **Method:** `PUT`
- **URL:** `http://localhost:5000/api/users/5`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "fullName": "Updated Test User",
  "isActive": true,
  "roleIds": [3, 4]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": 5,
    "username": "testuser",
    "fullName": "Updated Test User",
    "roles": [...]
  }
}
```

---

### **Test 7: Delete User**

**Request:**
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/users/5`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Cases:**
- ❌ Delete own account → 400 Bad Request
- ❌ Non-existent user → 404 Not Found

---

## 🎭 Role Management Tests

### **Test 8: Get All Roles**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/roles`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "roles": [
    {
      "id": 1,
      "name": "Admin",
      "description": "Full system access",
      "level": 100,
      "permissions": [...]
    },
    // ... more roles
  ]
}
```

---

### **Test 9: Create New Role**

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/roles`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Viewer",
  "description": "Read-only access",
  "level": 5,
  "permissionIds": [2, 6, 13]
}
```

---

## 🔑 Permission Tests

### **Test 10: Get All Permissions**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/permissions`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**
```json
{
  "success": true,
  "permissions": [
    {
      "id": 1,
      "name": "create:users",
      "action": "create",
      "resource": "users",
      "description": "Create users"
    },
    // ... more permissions
  ]
}
```

---

## 📊 Audit Log Tests

### **Test 11: View Audit Logs**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/audit?page=1&limit=20`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `action` - Filter by action (optional)
- `status` - Filter by status: success/failed/denied (optional)
- `userId` - Filter by user ID (optional)

**Example with filters:**
```
http://localhost:5000/api/audit?status=failed&action=login
```

**Expected Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": 15,
      "userId": 1,
      "action": "login",
      "resource": "auth",
      "status": "success",
      "ipAddress": "::1",
      "timestamp": "2024-11-27T10:30:00.000Z",
      "user": {
        "username": "admin"
      }
    },
    // ... more logs
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### **Test 12: Get Audit Statistics**

**Request:**
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/audit/stats`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "totalLogs": 45,
    "successLogs": 38,
    "failedLogs": 5,
    "deniedLogs": 2
  }
}
```

---

## 🧪 Authorization Testing Scenarios

### **Scenario 1: Admin Access (Should succeed)**
1. Login as `admin` with `Admin@123`
2. Try all endpoints → All should work ✅

### **Scenario 2: Manager Access (Limited)**
1. Login as `manager` with `Manager@123`
2. GET `/api/users` → ✅ Success (has read:users)
3. POST `/api/users` → ❌ 403 Forbidden (no create:users)
4. GET `/api/audit` → ✅ Success (has read:audit)

### **Scenario 3: HR Access (User management only)**
1. Login as `hruser` with `HR@123`
2. POST `/api/users` → ✅ Success (has create:users)
3. GET `/api/audit` → ❌ 403 Forbidden (no read:audit)
4. DELETE `/api/roles` → ❌ 403 Forbidden (no delete:roles)

### **Scenario 4: Employee Access (Minimal)**
1. Login as `employee` with `Employee@123`
2. GET `/api/users` → ✅ Success (can read users)
3. POST `/api/users` → ❌ 403 Forbidden (no create permission)
4. DELETE `/api/users/1` → ❌ 403 Forbidden (no delete permission)

### **Scenario 5: No Token (Should fail)**
1. Don't include `Authorization` header
2. Try any protected route → ❌ 401 Unauthorized

### **Scenario 6: Invalid Token (Should fail)**
1. Use `Authorization: Bearer invalid_token_12345`
2. Try any protected route → ❌ 401 Unauthorized

---

## 🔧 Common Postman Issues & Fixes

### ❌ **Error: "Cannot find module"**
**Solution:** Make sure backend server is running (`npm run dev`)

### ❌ **Error: "CORS policy"**
**Solution:** Check `.env` file has `CORS_ORIGIN=http://localhost:5173`

### ❌ **Error: "Invalid token"**
**Solution:** 
1. Token might be expired (login again)
2. Check for extra spaces in `Authorization` header
3. Format must be exactly: `Bearer YOUR_TOKEN` (with space)

### ❌ **Error: "Route not found"**
**Solution:** Check URL is correct (e.g., `/api/users` not `/users`)

### ❌ **Error: "Insufficient permissions"**
**Solution:** User doesn't have required permission. Login with Admin or check role permissions.

---

## 📦 Save Postman Collection

After creating all requests:

1. Click **...** next to collection name
2. Select **Export**
3. Save as `RBAC_System_API.postman_collection.json`
4. Share with team or submit with project

---

## 🎯 Testing Checklist

Use this to verify your RBAC system works correctly:

- [ ] Server health check works
- [ ] Can login with all 4 test users
- [ ] Admin can access all endpoints
- [ ] Manager can read but not create/delete
- [ ] HR can manage users but not see audit logs
- [ ] Employee has minimal access
- [ ] Invalid tokens are rejected
- [ ] Missing tokens return 401
- [ ] All actions are logged in audit table
- [ ] Passwords are hashed (check database directly)
- [ ] CORS works (try from browser console)

---

## 🚀 Advanced Testing Tips

### **Environment Variables in Postman**

Create different environments for Development/Production:

1. Click **Environments** in Postman
2. Create "Development" environment
3. Add variables:
   - `base_url` = `http://localhost:5000`
   - `token` = (leave empty, set after login)

4. Use in requests: `{{base_url}}/api/users`

### **Pre-request Scripts**

Auto-login before each request:

```javascript
// In Collection > Pre-request Script
pm.sendRequest({
    url: pm.environment.get('base_url') + '/api/auth/login',
    method: 'POST',
    header: 'Content-Type:application/json',
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            username: 'admin',
            password: 'Admin@123'
        })
    }
}, function (err, res) {
    pm.environment.set('token', res.json().token);
});
```

---

**Happy Testing! 🎉** Your RBAC system is now ready for comprehensive security testing!