import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminReports = ({ items }) => {
  // Category-based solved vs pending
  const categories = ['electronics', 'id-cards', 'books'];
  const chartData = categories.map(cat => {
    const catItems = items.filter(i => i.category === cat);
    return {
      category: cat === 'id-cards' ? 'ID Cards' : cat.charAt(0).toUpperCase() + cat.slice(1),
      solved: catItems.filter(i => i.status === 'RESOLVED').length,
      pending: catItems.filter(i => i.status !== 'RESOLVED').length,
    };
  });

  // Summary stats
  const totalThisMonth = items.length;
  const resolvedCount = items.filter(i => i.status === 'RESOLVED').length;
  const resolutionRate = totalThisMonth > 0 ? Math.round((resolvedCount / totalThisMonth) * 100) : 0;
  const avgResolutionDays = resolvedCount > 0 ? 2.3 : 0; // Mock value

  const handleExport = () => {
    window.print();
  };

  return (
    <>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Analytics & Reports</h2>
        <button className="export-btn" onClick={handleExport}>📄 Export Report as PDF</button>
      </div>

      {/* Main Bar Chart */}
      <div className="admin-chart-card" style={{ marginBottom: '30px' }}>
        <h3 className="admin-chart-title">Cases Solved vs Pending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
            <XAxis dataKey="category" tick={{ fill: '#764ba2', fontSize: 14, fontWeight: 600 }} />
            <YAxis tick={{ fill: '#764ba2', fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="solved" name="Solved" fill="#667eea" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#a68ada" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="admin-summary-row">
        <div className="admin-summary-card" style={{ animation: 'cardReveal 0.4s ease both' }}>
          <div className="admin-summary-number">{totalThisMonth}</div>
          <div className="admin-summary-label">Total Cases This Month</div>
        </div>
        <div className="admin-summary-card" style={{ animation: 'cardReveal 0.4s 0.1s ease both' }}>
          <div className="admin-summary-number" style={{ color: resolutionRate > 50 ? '#28a745' : '#dc3545' }}>
            {resolutionRate}%
          </div>
          <div className="admin-summary-label">Resolution Rate</div>
        </div>
        <div className="admin-summary-card" style={{ animation: 'cardReveal 0.4s 0.2s ease both' }}>
          <div className="admin-summary-number">{avgResolutionDays}</div>
          <div className="admin-summary-label">Avg. Resolution (Days)</div>
        </div>
      </div>
    </>
  );
};

export default AdminReports;
