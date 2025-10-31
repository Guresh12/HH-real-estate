import { Home, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Elite Properties</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Properties
            </Link>
            <Link to="/plots" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Plots
            </Link>
            <Link to="/site-visit" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Schedule Visit
            </Link>
            <Link
              to="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
