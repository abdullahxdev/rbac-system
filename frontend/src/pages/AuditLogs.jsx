import { useEffect, useState } from 'react';
import { auditAPI } from '../utils/api';
import { FileText, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 20, action: '', status: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        auditAPI.getLogs(filters),
        auditAPI.getStats(),
      ]);
      setLogs(logsRes.data.logs);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success': return <span className="badge-success flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Success</span>;
      case 'failed': return <span className="badge-error flex items-center"><XCircle className="w-3 h-3 mr-1" />Failed</span>;
      case 'denied': return <span className="badge-warning flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Denied</span>;
      default: return <span className="badge-info">{status}</span>;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="w-8 h-8 mr-3 text-primary-500" />
          Audit Logs
        </h1>
        <p className="text-gray-400 mt-1">Monitor system activities and security events</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-blue-500/10 border-blue-500/20">
            <p className="text-sm text-gray-400 mb-1">Total Logs</p>
            <p className="text-3xl font-bold">{stats.totalLogs}</p>
          </div>
          <div className="card bg-green-500/10 border-green-500/20">
            <p className="text-sm text-gray-400 mb-1">Success</p>
            <p className="text-3xl font-bold text-green-400">{stats.successLogs}</p>
          </div>
          <div className="card bg-red-500/10 border-red-500/20">
            <p className="text-sm text-gray-400 mb-1">Failed</p>
            <p className="text-3xl font-bold text-red-400">{stats.failedLogs}</p>
          </div>
          <div className="card bg-yellow-500/10 border-yellow-500/20">
            <p className="text-sm text-gray-400 mb-1">Denied</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.deniedLogs}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Action</label>
            <input type="text" value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })} className="input-field" placeholder="e.g., login, create_user" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })} className="input-field">
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="denied">Denied</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => setFilters({ page: 1, limit: 20, action: '', status: '' })} className="btn-secondary w-full">Clear Filters</button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Resource</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.user ? (
                      <span className="text-gray-300">{log.user.username}</span>
                    ) : (
                      <span className="text-gray-500">System</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary-400">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{log.resource}</td>
                  <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">{log.ipAddress || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing page {filters.page}
        </p>
        <div className="flex space-x-2">
          <button onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })} disabled={filters.page === 1} className="btn-secondary disabled:opacity-50">
            Previous
          </button>
          <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={logs.length < filters.limit} className="btn-secondary disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}