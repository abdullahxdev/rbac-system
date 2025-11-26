import express from 'express';
import { Role, Permission, User } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { logAudit } from '../middleware/auditLogger.js';

const router = express.Router();

router.get('/', authenticate, authorize('read:roles'), async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Permission, as: 'permissions' }]
    });
    res.json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
});

router.get('/:id', authenticate, authorize('read:roles'), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [
        { model: Permission, as: 'permissions' },
        { model: User, as: 'users', attributes: ['id', 'username', 'email', 'fullName'] }
      ]
    });
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    res.json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch role' });
  }
});

router.post('/', authenticate, authorize('create:roles'), logAudit('create_role', 'roles'), async (req, res) => {
  try {
    const { name, description, level, permissionIds } = req.body;
    const role = await Role.create({ name, description, level });
    
    if (permissionIds?.length > 0) {
      const permissions = await Permission.findAll({ where: { id: permissionIds } });
      await role.addPermissions(permissions);
    }
    
    const createdRole = await Role.findByPk(role.id, {
      include: [{ model: Permission, as: 'permissions' }]
    });
    
    res.status(201).json({ success: true, message: 'Role created', role: createdRole });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create role' });
  }
});

router.put('/:id', authenticate, authorize('update:roles'), logAudit('update_role', 'roles'), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    
    const { name, description, level, permissionIds } = req.body;
    await role.update({ name, description, level });
    
    if (permissionIds) {
      const permissions = await Permission.findAll({ where: { id: permissionIds } });
      await role.setPermissions(permissions);
    }
    
    const updated = await Role.findByPk(role.id, {
      include: [{ model: Permission, as: 'permissions' }]
    });
    
    res.json({ success: true, message: 'Role updated', role: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
});

router.delete('/:id', authenticate, authorize('delete:roles'), logAudit('delete_role', 'roles'), async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    await role.destroy();
    res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete role' });
  }
});

export default router;