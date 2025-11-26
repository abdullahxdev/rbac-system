import express from 'express';
import { Op } from 'sequelize';
import { User, Role, Permission } from '../models/index.js';
import { authenticate, authorize, requireRole } from '../middleware/auth.js';
import { logAudit } from '../middleware/auditLogger.js';

const router = express.Router();

// Get all users (requires read:users permission)
router.get('/', 
  authenticate, 
  authorize('read:users'),
  logAudit('view_users', 'users'),
  async (req, res) => {
    try {
      const users = await User.findAll({
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name', 'description']
        }],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message
      });
    }
  }
);

// Get single user
router.get('/:id',
  authenticate,
  authorize('read:users'),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }
  }
);

// Create user (Admin only)
router.post('/',
  authenticate,
  authorize('create:users'),
  logAudit('create_user', 'users'),
  async (req, res) => {
    try {
      const { username, email, password, fullName, roleIds } = req.body;

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      const user = await User.create({ username, email, password, fullName });

      if (roleIds && roleIds.length > 0) {
        const roles = await Role.findAll({ where: { id: roleIds } });
        await user.addRoles(roles);
      }

      const createdUser = await User.findByPk(user.id, {
        include: [{ model: Role, as: 'roles' }],
        attributes: { exclude: ['password'] }
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: createdUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  }
);

// Update user
router.put('/:id',
  authenticate,
  authorize('update:users'),
  logAudit('update_user', 'users'),
  async (req, res) => {
    try {
      const { fullName, email, isActive, roleIds } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (typeof isActive !== 'undefined') user.isActive = isActive;

      await user.save();

      if (roleIds) {
        const roles = await Role.findAll({ where: { id: roleIds } });
        await user.setRoles(roles);
      }

      const updatedUser = await User.findByPk(user.id, {
        include: [{ model: Role, as: 'roles' }],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }
  }
);

// Delete user
router.delete('/:id',
  authenticate,
  authorize('delete:users'),
  logAudit('delete_user', 'users'),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent deleting yourself
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

export default router;