import { useEffect, useState } from 'react';
import { permissionAPI, resourceAPI } from '../utils/api';
import { Key, Plus, Edit, Trash2, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function Permissions() {
  const { hasPermission } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerm, setEditingPerm] = useState(null);
  const [formData, setFormData] = useState({ name: '', action: '', resource: '', description: '', resourceId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [permsRes, resourcesRes] = await Promise.all([
        permissionAPI.getAll(),
        resourceAPI.getAll().catch(() => ({ data: { resources: [] } })),
      ]);
      setPermissions(permsRes.data.permissions);
      setResources(resourcesRes.data.resources);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerm) {
        await permissionAPI.update(editingPerm.id, formData);
      } else {
        await permissionAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this permission?')) {
      try {
        await permissionAPI.delete(id);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const openEditModal = (perm) => {
    setEditingPerm(perm);
    setFormData({ name: perm.name, action: perm.action, resource: perm.resource, description: perm.description, resourceId: perm.resourceId });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingPerm(null);
    setFormData({ name: '', action: '', resource: '', description: '', resourceId: '' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Key className="w-8 h-8 mr-3 text-primary-500" />
            Permission Management
          </h1>
          <p className="text-gray-400 mt-1">Manage system permissions and actions</p>
        </div>
        {hasPermission('create:permissions') && (
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Permission</span>
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Permission</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Resource</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                {(hasPermission('update:permissions') || hasPermission('delete:permissions')) && (
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-primary-400">{perm.name}</td>
                  <td className="px-6 py-4"><span className="badge-success">{perm.action}</span></td>
                  <td className="px-6 py-4 text-gray-300">{perm.resource}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{perm.description}</td>
                  {(hasPermission('update:permissions') || hasPermission('delete:permissions')) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {hasPermission('update:permissions') && (
                          <button onClick={() => openEditModal(perm)} className="p-2 hover:bg-gray-700 rounded-lg">
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                        )}
                        {hasPermission('delete:permissions') && (
                          <button onClick={() => handleDelete(perm.id)} className="p-2 hover:bg-gray-700 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingPerm ? 'Edit' : 'Add'} Permission</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Permission Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="create:users" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                <select value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} className="input-field" required>
                  <option value="">Select action</option>
                  <option value="create">Create</option>
                  <option value="read">Read</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resource</label>
                <input type="text" value={formData.resource} onChange={(e) => setFormData({ ...formData, resource: e.target.value })} className="input-field" placeholder="users" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="2" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingPerm ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}