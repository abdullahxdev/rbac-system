import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, CheckCircle, Key, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Floating security icons animation
  const floatingIcons = [
    { Icon: Shield, delay: '0s', duration: '20s', left: '10%', top: '15%' },
    { Icon: Lock, delay: '2s', duration: '18s', left: '80%', top: '20%' },
    { Icon: Key, delay: '4s', duration: '22s', left: '15%', top: '70%' },
    { Icon: ShieldCheck, delay: '1s', duration: '19s', left: '85%', top: '65%' },
    { Icon: UserCheck, delay: '3s', duration: '21s', left: '50%', top: '10%' },
    { Icon: CheckCircle, delay: '5s', duration: '17s', left: '90%', top: '85%' },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="absolute opacity-5 pointer-events-none"
          style={{
            left: item.left,
            top: item.top,
            animation: `float ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          <item.Icon className="w-16 h-16 text-primary-500" />
        </div>
      ))}

      {/* Animated CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <div className="max-w-lg">
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl shadow-2xl shadow-primary-500/50 animate-pulse">
              <Shield className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gradient mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                RBAC System
              </h1>
              <p className="text-gray-400 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                Secure Role-Based Access Control
              </p>
            </div>
          </div>

          {/* Catchy Phrases */}
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all">
              <div className="bg-primary-500/10 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Enterprise-Grade Security
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Protect your resources with industry-standard RBAC implementation
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Granular Access Control
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Define precise permissions for every user and role
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50 hover:border-primary-500/50 transition-all">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Complete Audit Trail
                </h3>
                <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Track every action with comprehensive security logging
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Built with modern security standards • NIST RBAC Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg shadow-primary-500/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              RBAC System
            </h1>
            <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Secure Role-Based Access Control
            </p>
          </div>

          {/* Login Card */}
          <div className="card backdrop-blur-xl bg-gray-900/80 border-gray-700">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Login to Your Account
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="input-field pl-10"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="input-field pl-10"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Test Credentials */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Test Credentials:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Admin:</p>
                  <p className="text-gray-300 font-mono">admin / Admin@123</p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Manager:</p>
                  <p className="text-gray-300 font-mono">manager / Manager@123</p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>HR:</p>
                  <p className="text-gray-300 font-mono">hruser / HR@123</p>
                </div>
                <div>
                  <p className="text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>Employee:</p>
                  <p className="text-gray-300 font-mono">employee / Employee@123</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Information Security Project © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}