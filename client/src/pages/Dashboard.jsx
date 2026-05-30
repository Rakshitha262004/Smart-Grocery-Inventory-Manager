import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a855f7','#06b6d4'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getDashboard().then(r => setSummary(r.data)).catch(console.error);
  }, []);

  if (!summary) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-green-400 text-xl">Loading...</p>
    </div>
  );

  const chartData = Object.entries(summary.categoryBreakdown).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-1">Hello, {user?.name} 👋</h1>
        <p className="text-gray-400 mb-8">Your grocery inventory at a glance</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Items',    value: summary.totalItems,               icon: '📦', color: 'border-blue-500' },
            { label: 'Low Stock',      value: summary.lowStockItems.length,     icon: '🚨', color: 'border-red-500' },
            { label: 'Expiring Soon',  value: summary.expiringSoonItems.length, icon: '⏰', color: 'border-yellow-500' },
          ].map(card => (
            <div key={card.label} className={`bg-gray-800 rounded-2xl p-6 border ${card.color}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-4xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Alert */}
        {summary.lowStockItems.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/40 rounded-2xl p-5 mb-4">
            <h2 className="text-red-400 font-bold text-lg mb-3">🚨 Low Stock Items</h2>
            {summary.lowStockItems.map(item => (
              <div key={item._id} className="flex justify-between bg-red-900/20 rounded-lg px-4 py-2 mb-2">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-red-400 text-sm">{item.quantity} {item.unit} left (min: {item.minStock})</span>
              </div>
            ))}
          </div>
        )}

        {/* Expiry Alert */}
        {summary.expiringSoonItems.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/40 rounded-2xl p-5 mb-4">
            <h2 className="text-yellow-400 font-bold text-lg mb-3">⏰ Expiring Within 7 Days</h2>
            {summary.expiringSoonItems.map(item => (
              <div key={item._id} className="flex justify-between bg-yellow-900/20 rounded-lg px-4 py-2 mb-2">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-yellow-400 text-sm">Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pie Chart */}
        {chartData.length > 0 && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
            <h2 className="text-white font-bold text-lg mb-4">📊 Items by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <Link to="/grocery" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl">
          View Full Inventory →
        </Link>
      </div>
    </div>
  );
}