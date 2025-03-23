import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Sliders,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Edit3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center">
              <Package className="text-primary-500 mr-2" size={24} />
              <h1 className="text-xl font-bold">InAllMedia</h1>
            </div>
            <p className="text-sm text-gray-400 mt-1">Product Management</p>
          </div>

          {/* User profile */}
          <div className="px-5 py-4 border-b border-gray-800">
            <div className="flex items-center">
              <User className="text-gray-400 mr-2" size={20} />
              <span className="font-medium">{user?.username || "Guest"}</span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ShoppingCart size={20} className="mr-3" /> All Products
            </Link>
            <Link
              to="/filter"
              className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Sliders size={20} className="mr-3" /> Filter Products
            </Link>
            <Link
              to="/sorted"
              className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <BarChart3 size={20} className="mr-3" /> Price Sorted Products
            </Link>
            <Link
              to="/manage"
              className="flex items-center px-4 py-3 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Edit3 size={20} className="mr-3" /> Manage Products
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>

            <div className="text-xs text-gray-400 mt-4">
              <p>© 2023 InAllMedia</p>
              <p>Product Management System</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
