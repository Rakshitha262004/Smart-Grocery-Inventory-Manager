import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getItems, deleteItem, updateQty } from '../services/api';

export default function GroceryList() {
  const [items, setItems]       = useState([]);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const fetchItems = async () => {
    try { const { data } = await getItems(); setItems(data); }
    catch { toast.error('Failed to load items'); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try { await deleteItem(id); toast.success('Deleted!'); fetchItems(); }
    catch { toast.error('Delete failed'); }
  };

  const handleQty = async (id, change) => {
    try {
      const { data } = await updateQty(id, change);
      setItems(prev => prev.map(i => i._id === id ? data : i));
    } catch { toast.error('Update failed'); }
  };

  const categories = ['All', ...new Set(items.map(i => i.category))];

  const filtered = items
    .filter(i => category === 'All' || i.category === category)
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const isLowStock    = (i) => i.quantity <= i.minStock;
  const isExpiring    = (i) => { if (!i.expiryDate) return false; const diff = new Date(i.expiryDate) - new Date(); return diff > 0 && diff < 7 * 86400000; };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">🛒 Inventory</h1>
          <Link to="/add" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg">+ Add Item</Link>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Items Grid */}
        {filtered.length === 0
          ? <p className="text-center text-gray-500 mt-20">No items found. <Link to="/add" className="text-green-400">Add one?</Link></p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(item => (
                <div key={item._id} className={`bg-gray-800 rounded-2xl p-5 border ${isLowStock(item) ? 'border-red-500/60' : isExpiring(item) ? 'border-yellow-500/60' : 'border-gray-700'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{item.category}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {isLowStock(item) && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Low Stock</span>}
                      {isExpiring(item) && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">Expiring</span>}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => handleQty(item._id, -1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-red-500 text-white rounded-full font-bold transition-all">−</button>
                    <span className="text-white font-bold text-xl">{item.quantity} <span className="text-gray-400 text-sm">{item.unit}</span></span>
                    <button onClick={() => handleQty(item._id, 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-green-500 text-white rounded-full font-bold transition-all">+</button>
                  </div>

                  {item.expiryDate && (
                    <p className="text-gray-400 text-xs mb-3">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/edit/${item._id}`)}
                      className="flex-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 py-1.5 rounded-lg text-sm transition-all">Edit</button>
                    <button onClick={() => handleDelete(item._id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 py-1.5 rounded-lg text-sm transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}