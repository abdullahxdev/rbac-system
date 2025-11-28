import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ children, permission, role }) {
  const { user, loading, hasPermission, hasRole } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to view this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required: {permission}</p>
        </div>
      </div>
    );
  }

  if (role && !hasRole(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have the required role.</p>
          <p className="text-sm text-gray-500 mt-2">Required: {role}</p>
        </div>
      </div>
    );
  }

  return children;
}