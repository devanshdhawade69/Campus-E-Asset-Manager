import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Item } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Common dark theme chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: '#e2e8f0',
  plugins: {
    legend: {
      labels: { color: '#e2e8f0' }
    }
  }
};

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dark-page"><div className="loading-spinner"></div></div>;

  if (items.length === 0) {
    return (
      <div className="dark-page p-4 text-center">
        <h1 className="page-title">Dashboard</h1>
        <div className="glass-card max-w-lg mx-auto p-4">
          <p className="mb-4">No data available to show analytics.</p>
          <Link to="/add" className="btn-primary">Add items to inventory</Link>
        </div>
      </div>
    );
  }

  // --- Metrics ---
  const totalItems = items.length;
  const uniqueDevices = new Set(items.map(i => i.deviceType)).size;
  const pendingDisposal = items.filter(i => {
    const c = i.condition?.toLowerCase();
    return c === 'poor' || c === 'broken';
  }).length;

  // --- Charts Data ---
  const deviceCounts = items.reduce((acc, cur) => {
    const type = cur.deviceType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = {
    labels: Object.keys(deviceCounts),
    datasets: [{
      label: 'Items per Device Type',
      data: Object.values(deviceCounts),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  const conditionCounts = items.reduce((acc, cur) => {
    const c = cur.condition || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const doughnutData = {
    labels: Object.keys(conditionCounts),
    datasets: [{
      data: Object.values(conditionCounts),
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)', // Green
        'rgba(59, 130, 246, 0.7)', // Blue
        'rgba(245, 158, 11, 0.7)', // Amber
        'rgba(239, 68, 68, 0.7)'   // Red
      ],
      borderColor: '#0a0a0f',
      borderWidth: 2
    }]
  };

  // Staggered animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="dark-page p-4">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="page-title">Analytics Dashboard</h1>
          <Link to="/" className="btn-ghost">Back to Inventory</Link>
        </div>

        <motion.div variants={container} initial="hidden" animate="show">
          <div className="stats-grid">
            <motion.div variants={itemVariant} className="glass-card stat-card glow-border">
              <div className="stat-value">{totalItems}</div>
              <div className="stat-label">Total Items</div>
            </motion.div>
            <motion.div variants={itemVariant} className="glass-card stat-card glow-border">
              <div className="stat-value">{uniqueDevices}</div>
              <div className="stat-label">Device Types</div>
            </motion.div>
            <motion.div variants={itemVariant} className="glass-card stat-card glow-border">
              <div className="stat-value text-red-600">{pendingDisposal}</div>
              <div className="stat-label">Pending Disposal</div>
            </motion.div>
          </div>

          <div className="charts-grid">
            <motion.div variants={itemVariant} className="chart-card glass-card">
              <h3 className="text-xl mb-4 text-center">Items by Device Type</h3>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Bar 
                  data={barData} 
                  options={{
                    ...commonOptions,
                    scales: {
                      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af', stepSize: 1 } }
                    }
                  }} 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariant} className="chart-card glass-card">
              <h3 className="text-xl mb-4 text-center">Item Conditions</h3>
              <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                <Doughnut data={doughnutData} options={commonOptions} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
