import { sequelize } from '../config/database.js';
import User from './user.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Resource from './Resource.js';
import AuditLog from './AuditLog.js';

// Define relationships

// User - Role (Many-to-Many)
User.belongsToMany(Role, { through: 'UserRoles', as: 'roles' });
Role.belongsToMany(User, { through: 'UserRoles', as: 'users' });

// Role - Permission (Many-to-Many)
Role.belongsToMany(Permission, { through: 'RolePermissions', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'RolePermissions', as: 'roles' });

// Permission - Resource (Many-to-One)
Permission.belongsTo(Resource, { foreignKey: 'resourceId', as: 'resourceDetail' });
Resource.hasMany(Permission, { foreignKey: 'resourceId', as: 'permissions' });

// AuditLog - User (Many-to-One)
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

export {
  sequelize,
  User,
  Role,
  Permission,
  Resource,
  AuditLog
};