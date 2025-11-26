import { sequelize, User, Role, Permission, Resource } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Sync database (recreate tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create Resources
    const resources = await Resource.bulkCreate([
      { name: 'users', type: 'endpoint', path: '/api/users', description: 'User management' },
      { name: 'roles', type: 'endpoint', path: '/api/roles', description: 'Role management' },
      { name: 'permissions', type: 'endpoint', path: '/api/permissions', description: 'Permission management' },
      { name: 'resources', type: 'endpoint', path: '/api/resources', description: 'Resource management' },
      { name: 'audit', type: 'endpoint', path: '/api/audit', description: 'Audit logs' },
      { name: 'dashboard', type: 'page', path: '/dashboard', description: 'Dashboard page' },
      { name: 'reports', type: 'page', path: '/reports', description: 'Reports page' }
    ]);
    console.log('✅ Resources created');

    // Create Permissions
    const permissions = await Permission.bulkCreate([
      { name: 'create:users', action: 'create', resource: 'users', description: 'Create users', resourceId: resources[0].id },
      { name: 'read:users', action: 'read', resource: 'users', description: 'View users', resourceId: resources[0].id },
      { name: 'update:users', action: 'update', resource: 'users', description: 'Update users', resourceId: resources[0].id },
      { name: 'delete:users', action: 'delete', resource: 'users', description: 'Delete users', resourceId: resources[0].id },
      
      { name: 'create:roles', action: 'create', resource: 'roles', description: 'Create roles', resourceId: resources[1].id },
      { name: 'read:roles', action: 'read', resource: 'roles', description: 'View roles', resourceId: resources[1].id },
      { name: 'update:roles', action: 'update', resource: 'roles', description: 'Update roles', resourceId: resources[1].id },
      { name: 'delete:roles', action: 'delete', resource: 'roles', description: 'Delete roles', resourceId: resources[1].id },
      
      { name: 'create:permissions', action: 'create', resource: 'permissions', description: 'Create permissions', resourceId: resources[2].id },
      { name: 'read:permissions', action: 'read', resource: 'permissions', description: 'View permissions', resourceId: resources[2].id },
      { name: 'update:permissions', action: 'update', resource: 'permissions', description: 'Update permissions', resourceId: resources[2].id },
      { name: 'delete:permissions', action: 'delete', resource: 'permissions', description: 'Delete permissions', resourceId: resources[2].id },
      
      { name: 'read:audit', action: 'read', resource: 'audit', description: 'View audit logs', resourceId: resources[4].id },
      { name: 'read:dashboard', action: 'read', resource: 'dashboard', description: 'View dashboard', resourceId: resources[5].id },
      { name: 'read:reports', action: 'read', resource: 'reports', description: 'View reports', resourceId: resources[6].id }
    ]);
    console.log('✅ Permissions created');

    // Create Roles
    const adminRole = await Role.create({ 
      name: 'Admin', 
      description: 'Full system access', 
      level: 100 
    });
    
    const managerRole = await Role.create({ 
      name: 'Manager', 
      description: 'Manage users and view reports', 
      level: 50 
    });
    
    const hrRole = await Role.create({ 
      name: 'HR', 
      description: 'Manage employees', 
      level: 40 
    });
    
    const employeeRole = await Role.create({ 
      name: 'Employee', 
      description: 'Basic access', 
      level: 10 
    });
    
    console.log('✅ Roles created');

    // Assign Permissions to Roles
    await adminRole.addPermissions(permissions); // Admin gets all permissions
    
    await managerRole.addPermissions([
      permissions[1], // read:users
      permissions[2], // update:users
      permissions[5], // read:roles
      permissions[12], // read:audit
      permissions[13], // read:dashboard
      permissions[14]  // read:reports
    ]);
    
    await hrRole.addPermissions([
      permissions[0], // create:users
      permissions[1], // read:users
      permissions[2], // update:users
      permissions[13]  // read:dashboard
    ]);
    
    await employeeRole.addPermissions([
      permissions[1], // read:users (own profile)
      permissions[13]  // read:dashboard
    ]);
    
    console.log('✅ Permissions assigned to roles');

    // Create Users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@rbac.com',
      password: 'Admin@123',
      fullName: 'System Administrator',
      isActive: true
    });
    await admin.addRole(adminRole);
    
    const manager = await User.create({
      username: 'manager',
      email: 'manager@rbac.com',
      password: 'Manager@123',
      fullName: 'John Manager',
      isActive: true
    });
    await manager.addRole(managerRole);
    
    const hr = await User.create({
      username: 'hruser',
      email: 'hr@rbac.com',
      password: 'HR@123',
      fullName: 'Sarah HR',
      isActive: true
    });
    await hr.addRole(hrRole);
    
    const employee = await User.create({
      username: 'employee',
      email: 'employee@rbac.com',
      password: 'Employee@123',
      fullName: 'Mike Employee',
      isActive: true
    });
    await employee.addRole(employeeRole);
    
    console.log('✅ Users created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: Admin@123');
    console.log('\nManager:');
    console.log('  Username: manager');
    console.log('  Password: Manager@123');
    console.log('\nHR:');
    console.log('  Username: hruser');
    console.log('  Password: HR@123');
    console.log('\nEmployee:');
    console.log('  Username: employee');
    console.log('  Password: Employee@123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();