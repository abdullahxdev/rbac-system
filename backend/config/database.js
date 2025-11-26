import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true,
    underscored: false,
  }
});

export default sequelize;