import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Users,
  Map,
  Calendar,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Video
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { initializeSessionTimeout, clearSessionTimeout } from '../../lib/sessionTimeout';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Properties', href: '/admin/properties', icon: Building },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Plots', href: '/admin/plots', icon: Map },
  { name: 'Virtual Tours', href: '/admin/virtual-tours', icon: Video },
  { name: 'Site Visits', href: '/admin/site-visits', icon: Calendar },
  { name: 'Receipts', href: '/admin/receipts', icon: Receipt },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Website Content', href: '/admin/content', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  useEffect(() => {
    const cleanup = initializeSessionTimeout(async () => {
      await signOut();
      navigate('/admin/login');
    });

    return () => {
      cleanup();
      clearSessionTimeout();
    };
  }, [signOut, navigate]);

  const handleSignOut = async () => {
    clearSessionTimeout();
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMobileMenuOpen(false)} />

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link to="/admin/dashboard" className="text-white text-xl font-bold">
            Admin Portal
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full transition"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden mr-4 text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">
            Real Estate ERP System
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
