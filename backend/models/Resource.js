import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type: endpoint, page, file, database, etc.'
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL path or file path'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Resource;