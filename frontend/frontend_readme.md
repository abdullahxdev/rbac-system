# 🎨 Frontend - RBAC System

## 📋 Overview

Modern, dark-themed React frontend for the Role-Based Access Control (RBAC) system. Built with React 18, Tailwind CSS, and React Router for a responsive and intuitive user experience.

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| React Router | 6.20.0 | Client-side routing |
| Axios | 1.6.2 | HTTP client for API calls |
| Tailwind CSS | 3.3.6 | Utility-first styling |
| Lucide React | 0.263.1 | Beautiful icons |
| Vite | 5.0.8 | Build tool & dev server |

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── PrivateRoute.jsx # Route protection
│   │   └── LoadingSpinner.jsx # Loading states
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Dashboard
│   │   ├── Users.jsx       # User management
│   │   ├── Roles.jsx       # Role management
│   │   ├── Permissions.jsx # Permission management
│   │   └── AuditLogs.jsx   # Audit log viewer
│   ├── utils/
│   │   └── api.js          # API client configuration
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+ installed
- Backend server running on port 5000

### Steps

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:5173
```

---

## 🔐 Authentication

### Login Credentials

After seeding the backend database, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| Manager | `manager` | `Manager@123` |
| HR | `hruser` | `HR@123` |
| Employee | `employee` | `Employee@123` |

### Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend verifies credentials and returns JWT token
4. Token stored in `localStorage`
5. Token sent with every subsequent request via Axios interceptor
6. On 401 error, user redirected to login

### JWT Token Management

**Token Storage:**
```javascript
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Token Injection:**
```javascript
// Axios interceptor automatically adds token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🧩 Components

### Layout Components

#### **Layout.jsx**
Main application wrapper with navbar and content area.

**Features:**
- Responsive container
- Navbar integration
- React Router Outlet for nested routes

---

#### **Navbar.jsx**
Top navigation bar with user menu and role-based navigation.

**Features:**
- Responsive design (mobile hamburger menu)
- Permission-based navigation visibility
- User profile display
- Logout functionality
- Active route highlighting

**Permission Filtering:**
```javascript
navLinks.map(link => {
  if (link.permission && !hasPermission(link.permission)) {
    return null; // Hide link if no permission
  }
  return <Link>...</Link>;
});
```

---

#### **PrivateRoute.jsx**
Route protection wrapper that enforces authentication and permissions.

**Usage:**
```jsx
<Route 
  path="/users" 
  element={
    <PrivateRoute permission="read:users">
      <Users />
    </PrivateRoute>
  } 
/>
```

**Protection Levels:**
1. Authentication check (user must be logged in)
2. Permission check (user must have specific permission)
3. Role check (user must have specific role)

---

#### **LoadingSpinner.jsx**
Reusable loading indicator with multiple sizes.

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `fullScreen`: boolean (overlay entire screen)

---

### Page Components

#### **Login.jsx**
Authentication page with modern design.

**Features:**
- Username/password form
- Error message display
- Test credentials reference
- Gradient background
- Form validation

---

#### **Dashboard.jsx**
Main dashboard with system overview.

**Features:**
- Welcome message with user's name
- Statistics cards (users, roles, permissions, audit logs)
- User account details
- Permission list
- System information panel

**Data Fetching:**
```javascript
const [usersRes, rolesRes, permsRes, auditRes] = await Promise.all([
  userAPI.getAll(),
  roleAPI.getAll(),
  permissionAPI.getAll(),
  auditAPI.getStats()
]);
```

---

#### **Users.jsx**
Complete user management interface.

**Features:**
- User table with pagination
- Create user modal
- Edit user modal
- Delete user (with confirmation)
- Role assignment
- Active/Inactive status badges
- Permission-based action buttons

**CRUD Operations:**
- ✅ Create: Admin only (`create:users` permission)
- ✅ Read: All authenticated users
- ✅ Update: Admin/HR (`update:users` permission)
- ✅ Delete: Admin only (`delete:users` permission)

---

#### **Roles.jsx**
Role management with card-based UI.

**Features:**
- Roles displayed as cards
- Role hierarchy (level system)
- Permission count display
- Create/Edit role modal
- Multiple permission selection
- Delete role functionality

**Role Card Display:**
- Role name and description
- Level indicator
- Permission preview (shows first 3)
- Edit/Delete actions

---

#### **Permissions.jsx**
Permission management table.

**Features:**
- Permissions table
- Action type badges (create, read, update, delete)
- Resource display
- Create/Edit permission modal
- Permission filtering

**Permission Format:**
```
name: "create:users"
action: "create"
resource: "users"
description: "Create new users"
```

---

#### **AuditLogs.jsx**
Security audit log viewer.

**Features:**
- Audit log table with pagination
- Statistics cards (total, success, failed, denied)
- Filter by action/status
- Timestamp display
- User attribution
- IP address logging
- Status badges (success/failed/denied)

**Filter Options:**
- Action (e.g., "login", "create_user")
- Status (success, failed, denied)
- Date range (can be added)
- User ID (can be added)

---

## 🎨 Styling & Design

### Color Scheme

**Primary Colors:**
```css
primary-500: #0ea5e9  /* Main brand color */
primary-600: #0284c7  /* Hover states */
primary-700: #0369a1  /* Active states */
```

**Background Colors:**
```css
gray-950: #030712  /* Main background */
gray-900: #111827  /* Card background */
gray-800: #1f2937  /* Input backgrounds */
```

### Custom CSS Classes

**Buttons:**
```css
.btn-primary      /* Primary action button */
.btn-secondary    /* Secondary action button */
.btn-danger       /* Delete/destructive button */
```

**Form Elements:**
```css
.input-field      /* Text inputs, selects, textareas */
```

**Cards:**
```css
.card             /* Container with border and shadow */
```

**Badges:**
```css
.badge-success    /* Green badge */
.badge-warning    /* Yellow badge */
.badge-error      /* Red badge */
.badge-info       /* Blue badge */
```

### Responsive Design

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Mobile Optimizations:**
- Hamburger menu for navigation
- Stacked layout for cards
- Scrollable tables
- Touch-friendly button sizes

---

## 🔌 API Integration

### API Client (`utils/api.js`)

**Base Configuration:**
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});
```

**Request Interceptor:**
```javascript
// Automatically add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor:**
```javascript
// Handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints

**Authentication:**
```javascript
authAPI.login({ username, password })
authAPI.register({ username, email, password, fullName })
authAPI.getCurrentUser()
authAPI.logout()
```

**Users:**
```javascript
userAPI.getAll()
userAPI.getById(id)
userAPI.create(data)
userAPI.update(id, data)
userAPI.delete(id)
```

**Roles:**
```javascript
roleAPI.getAll()
roleAPI.getById(id)
roleAPI.create(data)
roleAPI.update(id, data)
roleAPI.delete(id)
```

**Permissions:**
```javascript
permissionAPI.getAll()
permissionAPI.getById(id)
permissionAPI.create(data)
permissionAPI.update(id, data)
permissionAPI.delete(id)
```

**Audit Logs:**
```javascript
auditAPI.getLogs(params)  // params: { page, limit, action, status }
auditAPI.getStats()
```

---

## 🛡️ Security Features

### 1. Protected Routes
Routes require authentication and specific permissions.

### 2. Permission-Based UI
UI elements hidden/shown based on user permissions.

### 3. XSS Prevention
- React auto-escapes JSX content
- Form inputs sanitized

### 4. CSRF Protection
- JWT tokens (not cookies)
- No state stored on server

### 5. Secure Token Storage
- Tokens in `localStorage` (acceptable for this project)
- Production: Consider `httpOnly` cookies

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Token expiration handling

**User Management:**
- [ ] View users list
- [ ] Create new user
- [ ] Edit user details
- [ ] Assign roles to user
- [ ] Delete user
- [ ] Prevent self-deletion

**Role Management:**
- [ ] View roles
- [ ] Create role
- [ ] Assign permissions to role
- [ ] Edit role
- [ ] Delete role

**Permission Management:**
- [ ] View permissions
- [ ] Create permission
- [ ] Edit permission
- [ ] Delete permission

**Audit Logs:**
- [ ] View audit logs
- [ ] Filter by action
- [ ] Filter by status
- [ ] Pagination works

**RBAC Enforcement:**
- [ ] Admin sees all features
- [ ] Manager has limited access
- [ ] Employee sees minimal features
- [ ] Direct URL access blocked without permission

---

## 🐛 Troubleshooting

### Issue: Can't login

**Check:**
1. Backend server is running (`http://localhost:5000/api/health`)
2. Database is seeded (`npm run seed` in backend)
3. CORS enabled in backend `.env`
4. Browser console for errors (F12)

**Solution:**
```bash
# Backend terminal
cd backend
npm run dev

# Should see: Server running on port 5000
```

---

### Issue: "Module not found"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue: Styles not loading

**Check:**
1. `tailwind.config.js` exists
2. `postcss.config.js` exists
3. `index.css` has `@tailwind` directives

**Solution:**
Restart Vite dev server: `npm run dev`

---

### Issue: API calls failing (CORS error)

**Check backend `.env`:**
```
CORS_ORIGIN=http://localhost:5173
```

**Restart backend:**
```bash
npm run dev
```

---

## 📦 Building for Production

### Build Command
```bash
npm run build
```

**Output:** `dist/` folder with optimized static files

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production

Create `.env.production`:
```
VITE_API_URL=https://your-api-domain.com/api
```

Update `api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

### Netlify

1. Push to GitHub
2. Import to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

### Manual Deployment

1. Build: `npm run build`
2. Upload `dist/` folder to web server
3. Configure web server to serve `index.html` for all routes

---

## 🎯 Future Enhancements

### Features to Add

1. **Multi-Factor Authentication (MFA)**
   - TOTP (Google Authenticator)
   - Email verification codes

2. **Advanced Filtering**
   - Date range pickers
   - Multi-select filters
   - Saved filter presets

3. **Data Export**
   - Export users to CSV
   - Export audit logs
   - PDF reports

4. **User Profile Page**
   - Change password
   - Update profile picture
   - Activity history

5. **Real-time Updates**
   - WebSocket notifications
   - Live audit log updates
   - User status indicators

6. **Dark/Light Mode Toggle**
   - Theme switcher
   - Persist preference

7. **Internationalization (i18n)**
   - Multi-language support

---

## 📚 Code Examples

### Creating a New Protected Page

1. **Create page component:**
```jsx
// src/pages/Reports.jsx
export default function Reports() {
  return <div>Reports Page</div>;
}
```

2. **Add route in App.jsx:**
```jsx
import Reports from './pages/Reports';

<Route 
  path="/reports" 
  element={
    <PrivateRoute permission="read:reports">
      <Reports />
    </PrivateRoute>
  } 
/>
```

3. **Add to navbar:**
```javascript
// In Navbar.jsx navLinks array
{ path: '/reports', label: 'Reports', permission: 'read:reports' }
```

---

### Making API Calls

```javascript
// In component
import { userAPI } from '../utils/api';

const fetchUsers = async () => {
  try {
    const response = await userAPI.getAll();
    setUsers(response.data.users);
  } catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'Failed to fetch users');
  }
};
```

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Guide](https://vitejs.dev)

---

## 📄 License

Information Security Course Project - 2024

---

**Built with ❤️ for Information Security Course**