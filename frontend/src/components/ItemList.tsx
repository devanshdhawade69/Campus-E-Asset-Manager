import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Item } from '../types';

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/items');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get('/items/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ewaste_export.csv';
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const getConditionBadge = (condition: string) => {
    const c = condition.toLowerCase();
    if (c === 'good') return 'badge badge-good';
    if (c === 'fair') return 'badge badge-fair';
    return 'badge badge-poor';
  };

  return (
    <div className="dark-page p-4">
      <div className="max-w-lg mx-auto" style={{ maxWidth: '1000px' }}>
        <h1 className="page-title">E-Waste Inventory</h1>
        
        <div className="flex gap-2 mb-4">
          <Link to="/add" className="btn-primary">+ Add Item</Link>
          <button onClick={exportCsv} className="btn-secondary">Export CSV</button>
          <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : items.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <p className="mb-4">No items found in inventory.</p>
            <Link to="/add" className="btn-primary">Add your first item</Link>
          </div>
        ) : (
          <div className="data-table-container glass-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Device Type</th>
                  <th>Serial Number</th>
                  <th>Condition</th>
                  <th>Disposal Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <td>{item.deviceType}</td>
                      <td>{item.serialNumber}</td>
                      <td>
                        <span className={getConditionBadge(item.condition)}>
                          {item.condition}
                        </span>
                      </td>
                      <td>{item.disposalMethod}</td>
                      <td className="actions-cell">
                        <Link to={`/edit/${item._id}`} className="btn-ghost">Edit</Link>
                        <button onClick={() => handleDelete(item._id!)} className="btn-danger">Delete</button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
