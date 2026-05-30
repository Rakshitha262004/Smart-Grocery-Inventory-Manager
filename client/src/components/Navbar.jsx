import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-green-400 font-bold text-xl">🛒 GroceryManager</Link>
        <div className="flex items-center gap-5">
          <Link to="/"        className="text-gray-300 hover:text-white text-sm">Dashboard</Link>
          <Link to="/grocery" className="text-gray-300 hover:text-white text-sm">Inventory</Link>
          <Link to="/add"     className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-1.5 px-4 rounded-lg">+ Add</Link>
          <span className="text-gray-400 text-sm">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
}