import express from 'express';
import { Resource, Permission } from '../models/index.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, requireRole('Admin', 'Manager'), async (req, res) => {
  try {
    const resources = await Resource.findAll({
      include: [{ model: Permission, as: 'permissions' }]
    });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resources' });
  }
});

router.get('/:id', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{ model: Permission, as: 'permissions' }]
    });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resource' });
  }
});

router.post('/', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const { name, type, path, description, isActive } = req.body;
    const resource = await Resource.create({ name, type, path, description, isActive });
    res.status(201).json({ success: true, message: 'Resource created', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create resource' });
  }
});

router.put('/:id', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    
    const { name, type, path, description, isActive } = req.body;
    await resource.update({ name, type, path, description, isActive });
    res.json({ success: true, message: 'Resource updated', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update resource' });
  }
});

router.delete('/:id', authenticate, requireRole('Admin'), async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    await resource.destroy();
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete resource' });
  }
});

export default router;