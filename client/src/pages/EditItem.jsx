import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getItems, updateItem } from '../services/api';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', category:'General', quantity:1, unit:'units', minStock:1, expiryDate:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getItems().then(({ data }) => {
      const item = data.find(i => i._id === id);
      if (!item) { toast.error('Item not found'); navigate('/grocery'); return; }
      setForm({
        name: item.name, category: item.category, quantity: item.quantity,
        unit: item.unit, minStock: item.minStock,
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ''
      });
    });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateItem(id, { ...form, expiryDate: form.expiryDate || null });
      toast.success('Item updated! ✅');
      navigate('/grocery');
    } catch (err) { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/grocery" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="text-3xl font-bold text-white">Edit Item ✏️</h1>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-1">Item Name</label>
              <input type="text" value={form.name} required
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Quantity</label>
                <input type="number" value={form.quantity} min="0"
                  onChange={e => setForm({...form, quantity: Number(e.target.value)})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-300 text-sm block mb-1">Unit</label>
                <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none">
                  {['kg','g','litres','ml','units','packets','dozen'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none">
                {['Grains','Dairy','Vegetables','Fruits','Beverages','Snacks','Meat','General'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-1">Min Stock</label>
              <input type="number" value={form.minStock} min="0"
                onChange={e => setForm({...form, minStock: Number(e.target.value)})}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-gray-300 text-sm block mb-1">Expiry Date (optional)</label>
              <input type="date" value={form.expiryDate}
                onChange={e => setForm({...form, expiryDate: e.target.value})}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <Link to="/grocery" className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 rounded-lg">Cancel</Link>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg">
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}