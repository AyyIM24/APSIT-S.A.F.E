import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminShell from '../../Components/admin/AdminShell';

const reportData = [
  { category: 'Electronics', solved: 12, pending: 5 },
  { category: 'ID Cards', solved: 8, pending: 3 },
  { category: 'Books', solved: 6, pending: 4 },
  { category: 'Others', solved: 4, pending: 2 },
];

const AdminReports = () => {
  const [data] = useState(reportData);

  const totalSolved = data.reduce((s, d) => s + d.solved, 0);
  const totalPending = data.reduce((s, d) => s + d.pending, 0);
  const totalCases = totalSolved + totalPending;
  const resolutionRate = totalCases > 0 ? ((totalSolved / totalCases) * 100).toFixed(1) : 0;

  const handleExport = () => {
    window.print();
  };

  return (
    <AdminShell pageTitle="Reports">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Analytics & Reports</h2>
        <button className="export-btn" onClick={handleExport}>📄 Export Report as PDF</button>
      </div>

      {/* Main Bar Chart */}
      <div className="admin-chart-card anim-chartFadeScale" style={{ marginBottom: '30px' }}>
        <h3 className="admin-chart-title">Cases Solved vs Pending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
            <XAxis dataKey="category" tick={{ fill: '#764ba2', fontSize: 13 }} />
            <YAxis tick={{ fill: '#764ba2', fontSize: 13 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="solved" name="Solved" fill="#667eea" radius={[6, 6, 0, 0]} animationDuration={600} />
            <Bar dataKey="pending" name="Pending" fill="#a68ada" radius={[6, 6, 0, 0]} animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="admin-stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="admin-stat-card anim-cardReveal" style={{ animationDelay: '0.1s' }}>
          <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>📊</div>
          <div>
            <div className="admin-stat-number">{totalCases}</div>
            <div className="admin-stat-label">Total Cases This Month</div>
          </div>
        </div>
        <div className="admin-stat-card anim-cardReveal" style={{ animationDelay: '0.2s' }}>
          <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>📈</div>
          <div>
            <div className="admin-stat-number">{resolutionRate}%</div>
            <div className="admin-stat-label">Resolution Rate</div>
          </div>
        </div>
        <div className="admin-stat-card anim-cardReveal" style={{ animationDelay: '0.3s' }}>
          <div className="admin-stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>⏱️</div>
          <div>
            <div className="admin-stat-number">2.3</div>
            <div className="admin-stat-label">Avg Resolution (Days)</div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminReports;
