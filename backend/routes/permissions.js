import express from 'express';
import { Permission, Resource, Role } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('read:permissions'), async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      include: [{ model: Resource, as: 'resourceDetail' }]
    });
    res.json({ success: true, permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
  }
});

router.get('/:id', authenticate, authorize('read:permissions'), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id, {
      include: [
        { model: Resource, as: 'resourceDetail' },
        { model: Role, as: 'roles' }
      ]
    });
    if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' });
    res.json({ success: true, permission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permission' });
  }
});

router.post('/', authenticate, authorize('create:permissions'), async (req, res) => {
  try {
    const { name, action, resource, description, resourceId } = req.body;
    const permission = await Permission.create({ name, action, resource, description, resourceId });
    res.status(201).json({ success: true, message: 'Permission created', permission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create permission' });
  }
});

router.put('/:id', authenticate, authorize('update:permissions'), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' });
    
    const { name, action, resource, description, resourceId } = req.body;
    await permission.update({ name, action, resource, description, resourceId });
    res.json({ success: true, message: 'Permission updated', permission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update permission' });
  }
});

router.delete('/:id', authenticate, authorize('delete:permissions'), async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ success: false, message: 'Permission not found' });
    await permission.destroy();
    res.json({ success: true, message: 'Permission deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete permission' });
  }
});

export default router;