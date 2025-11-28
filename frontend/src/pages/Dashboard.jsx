import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Key, FileText, Activity, CheckCircle } from 'lucide-react';
import { userAPI, roleAPI, permissionAPI, auditAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, rolesRes, permsRes, auditRes] = await Promise.all([
        userAPI.getAll().catch(() => ({ data: { count: 0 } })),
        roleAPI.getAll().catch(() => ({ data: { roles: [] } })),
        permissionAPI.getAll().catch(() => ({ data: { permissions: [] } })),
        auditAPI.getStats().catch(() => ({ data: { stats: {} } })),
      ]);

      setStats({
        users: usersRes.data.count || usersRes.data.users?.length || 0,
        roles: rolesRes.data.roles?.length || 0,
        permissions: permsRes.data.permissions?.length || 0,
        auditLogs: auditRes.data.stats?.totalLogs || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Roles',
      value: stats?.roles || 0,
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Permissions',
      value: stats?.permissions || 0,
      icon: Key,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      title: 'Audit Logs',
      value: stats?.auditLogs || 0,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-br from-primary-500/10 to-primary-700/10 border-primary-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.fullName}!</span>
            </h1>
            <p className="text-gray-400">
              You're logged in as{' '}
              <span className="font-semibold text-primary-400">
                {user?.roles?.map(r => r.name).join(', ')}
              </span>
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-xl shadow-primary-500/30">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`card ${stat.bgColor} ${stat.borderColor} hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-500" />
            Your Account
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Username:</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Full Name:</span>
              <span className="font-medium">{user?.fullName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Status:</span>
              <span className="badge-success flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Key className="w-5 h-5 mr-2 text-primary-500" />
            Your Permissions
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {user?.roles?.flatMap(role => role.permissions || []).length > 0 ? (
              user.roles.flatMap(role => role.permissions || []).map((perm, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <span className="font-mono text-sm text-gray-300">{perm.name}</span>
                  <span className="badge-info text-xs">{perm.action}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No permissions assigned</p>
            )}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card bg-gray-800/50">
        <h2 className="text-xl font-bold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Project Type</p>
            <p className="font-semibold">Information Security - RBAC System</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Technology Stack</p>
            <p className="font-semibold">Node.js + React + SQLite</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Security Features</p>
            <p className="font-semibold">JWT, bcrypt, RBAC, Audit Logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}