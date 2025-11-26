import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100]
    }
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Action type: create, read, update, delete, execute'
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Resource name: users, roles, reports, etc.'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Permission;