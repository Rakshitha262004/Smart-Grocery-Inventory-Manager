import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.user, data.token);
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account 🛒</h1>
        <p className="text-gray-400 mb-6">Start managing your groceries</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['Name','text','name','Your full name'],['Email','email','email','you@example.com'],['Password','password','password','Min 6 characters']].map(([label,type,field,ph]) => (
            <div key={field}>
              <label className="text-gray-300 text-sm block mb-1">{label}</label>
              <input type={type} value={form[field]} placeholder={ph} required
                onChange={e => setForm({...form, [field]: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}