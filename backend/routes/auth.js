import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User, Role, Permission } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { logAccess } from '../middleware/auditLogger.js';

const router = express.Router();

// Register
router.post('/register',
  [
    body('username').isLength({ min: 3 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { username, email, password, fullName } = req.body;

      const existingUser = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists'
        });
      }

      const user = await User.create({ username, email, password, fullName });
      
      // Assign default Employee role
      const employeeRole = await Role.findOne({ where: { name: 'Employee' } });
      if (employeeRole) {
        await user.addRole(employeeRole);
      }

      await logAccess(user.id, 'register', 'auth', 'success', { username });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: user.toSafeObject()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }
);

// Login
router.post('/login',
  [
    body('username').notEmpty(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { username, password } = req.body;

      const user = await User.findOne({
        where: { username },
        include: [{
          model: Role,
          as: 'roles',
          include: [{
            model: Permission,
            as: 'permissions'
          }]
        }]
      });

      if (!user) {
        await logAccess(null, 'login_failed', 'auth', 'failed', { username, reason: 'user_not_found' });
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await logAccess(user.id, 'login_failed', 'auth', 'failed', { username, reason: 'wrong_password' });
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      if (!user.isActive) {
        await logAccess(user.id, 'login_failed', 'auth', 'failed', { username, reason: 'inactive_account' });
        return res.status(403).json({
          success: false,
          message: 'Account is inactive'
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      await logAccess(user.id, 'login', 'auth', 'success', { username });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: user.toSafeObject()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }
);

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Logout (client-side mainly, but log the action)
router.post('/logout', authenticate, async (req, res) => {
  try {
    await logAccess(req.user.id, 'logout', 'auth', 'success');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

export default router;