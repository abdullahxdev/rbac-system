import { useEffect, useState } from 'react';
import { roleAPI, permissionAPI } from '../utils/api';
import { Shield, Plus, Edit, Trash2, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function Roles() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 0,
    permissionIds: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleAPI.getAll(),
        permissionAPI.getAll(),
      ]);
      setRoles(rolesRes.data.roles);
      setPermissions(permsRes.data.permissions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await roleAPI.update(editingRole.id, formData);
      } else {
        await roleAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this role?')) {
      try {
        await roleAPI.delete(id);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      level: role.level,
      permissionIds: role.permissions.map(p => p.id),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRole(null);
    setFormData({ name: '', description: '', level: 0, permissionIds: [] });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="w-8 h-8 mr-3 text-primary-500" />
            Role Management
          </h1>
          <p className="text-gray-400 mt-1">Manage system roles and permissions</p>
        </div>
        {hasPermission('create:roles') && (
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Role</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="card hover:border-primary-500/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-200">{role.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Level {role.level}</p>
              </div>
              {(hasPermission('update:roles') || hasPermission('delete:roles')) && (
                <div className="flex space-x-2">
                  {hasPermission('update:roles') && (
                    <button onClick={() => openEditModal(role)} className="p-2 hover:bg-gray-800 rounded-lg">
                      <Edit className="w-4 h-4 text-blue-400" />
                    </button>
                  )}
                  {hasPermission('delete:roles') && (
                    <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-gray-800 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-4">{role.description}</p>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500 mb-2">Permissions ({role.permissions?.length || 0})</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions?.slice(0, 3).map((perm) => (
                  <span key={perm.id} className="badge-info text-xs">{perm.name}</span>
                ))}
                {role.permissions?.length > 3 && (
                  <span className="badge-info text-xs">+{role.permissions.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingRole ? 'Edit Role' : 'Add New Role'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                <input type="number" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="input-field" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-gray-800 rounded-lg">
                  {permissions.map((perm) => (
                    <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={formData.permissionIds.includes(perm.id)} onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, permissionIds: [...formData.permissionIds, perm.id] });
                        } else {
                          setFormData({ ...formData, permissionIds: formData.permissionIds.filter(id => id !== perm.id) });
                        }
                      }} className="rounded border-gray-600" />
                      <span className="text-sm text-gray-300">{perm.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingRole ? 'Update' : 'Create'} Role</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}