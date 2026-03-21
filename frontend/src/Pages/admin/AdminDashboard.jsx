import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminShell from '../../Components/admin/AdminShell';

const COLORS = ['#667eea', '#764ba2', '#a68ada', '#cdc6ea'];

const mockItems = [
  { id: 1, name: "Blue HP Laptop", type: "lost", status: "SECURED", category: "electronics", location: "Library 2nd Floor", date: "2026-02-14" },
  { id: 2, name: "iPhone 13", type: "found", status: "SECURED", category: "electronics", location: "Canteen", date: "2026-02-13" },
  { id: 3, name: "APSIT ID Card", type: "lost", status: "SECURED", category: "id-cards", location: "Lab 402", date: "2026-02-12" },
  { id: 4, name: "Blue Umbrella", type: "found", status: "FOUND", category: "others", location: "Main Gate", date: "2026-02-11" },
  { id: 5, name: "Data Structures Notes", type: "lost", status: "RESOLVED", category: "books", location: "Seminar Hall", date: "2026-02-10" },
  { id: 6, name: "Calculator", type: "found", status: "SECURED", category: "electronics", location: "Lab 401", date: "2026-02-09" },
];

const AdminDashboard = () => {
  const [items] = useState(mockItems);
  const [scanning, setScanning] = useState(false);

  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;
  const pendingClaims = items.filter(i => i.status === 'LOST' || i.status === 'FOUND').length;
  const resolvedCount = items.filter(i => i.status === 'RESOLVED').length;
  const securedCount = items.filter(i => i.status === 'SECURED').length;

  const categoryMap = {};
  items.forEach(item => {
    const cat = item.category || 'others';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map(day => ({
    day,
    lost: Math.floor(Math.random() * 5) + 1,
    found: Math.floor(Math.random() * 4),
  }));

  const locationMap = {};
  items.forEach(item => {
    const loc = item.location || 'Unknown';
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });
  const topLocations = Object.entries(locationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxLocCount = topLocations.length > 0 ? topLocations[0][1] : 1;

  const total = items.length || 1;

  const stats = [
    { icon: '📦', label: 'Total Lost', count: lostCount, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: '🔍', label: 'Total Found', count: foundCount, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { icon: '⏳', label: 'Pending', count: pendingClaims, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: '✅', label: 'Resolved', count: resolvedCount, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ];

  useEffect(() => {
    if (scanning) {
      const scannerElement = document.getElementById("reader");
      if (!scannerElement) return;

      const scanner = new Html5QrcodeScanner("reader", { qrbox: { width: 250, height: 250 }, fps: 10 });
      scanner.render(success, error);

      function success(result) {
        console.log("Admin Scan Success:", result);
        scanner.clear();
        setScanning(false);
        alert(`Scanned: ${result}`);
      }

      function error(err) { /* silent */ }

      return () => {
        scanner.clear().catch(e => console.error(e));
      };
    }
  }, [scanning]);

  return (
    <AdminShell pageTitle="Dashboard">
      {/* Quick Action */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button className="admin-add-btn" onClick={() => setScanning(true)}>
          📷 Scan Verification QR
        </button>
      </div>

      {/* Stat Cards */}
      <div className="admin-stat-row">
        {stats.map((stat, idx) => (
          <div className="admin-stat-card" key={stat.label} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="admin-stat-icon" style={{ background: stat.gradient }}>
              {stat.icon}
            </div>
            <div>
              <div className="admin-stat-number">{stat.count}</div>
              <div className="admin-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="admin-chart-grid">
        {/* Donut Chart */}
        <div className="admin-chart-card anim-chartFadeScale" style={{ animationDelay: '0.2s' }}>
          <h3 className="admin-chart-title">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={3} dataKey="value"
              >
                {(categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Last 7 Days */}
        <div className="admin-chart-card anim-chartFadeScale" style={{ animationDelay: '0.4s' }}>
          <h3 className="admin-chart-title">Last 7 Days Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
              <XAxis dataKey="day" tick={{ fill: '#764ba2', fontSize: 13 }} />
              <YAxis tick={{ fill: '#764ba2', fontSize: 13 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="lost" name="Lost" fill="#667eea" radius={[6, 6, 0, 0]} />
              <Bar dataKey="found" name="Found" fill="#764ba2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 4 Locations */}
        <div className="admin-chart-card anim-chartFadeScale" style={{ animationDelay: '0.6s' }}>
          <h3 className="admin-chart-title">Top Locations Reported</h3>
          <div style={{ padding: '10px 0' }}>
            {topLocations.map(([loc, count]) => (
              <div className="admin-location-row" key={loc}>
                <span className="admin-location-name">{loc}</span>
                <div className="admin-location-bar-bg">
                  <div className="admin-location-bar-fill" style={{ width: `${(count / maxLocCount) * 100}%` }} />
                </div>
                <span className="admin-location-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="admin-chart-card anim-chartFadeScale" style={{ animationDelay: '0.8s' }}>
          <h3 className="admin-chart-title">Status Distribution</h3>
          <div className="admin-status-pills">
            <span className="admin-status-pill secured">🔐 Secured: {securedCount}</span>
            <span className="admin-status-pill claimed">⏳ Pending: {pendingClaims}</span>
            <span className="admin-status-pill resolved">✅ Resolved: {resolvedCount}</span>
          </div>
          <div className="admin-stacked-bar-bg">
            <div style={{ width: `${(securedCount / total) * 100}%`, background: '#d1c1f9' }} />
            <div style={{ width: `${(pendingClaims / total) * 100}%`, background: '#fff3cd' }} />
            <div style={{ width: `${(resolvedCount / total) * 100}%`, background: '#d4edda' }} />
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {scanning && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '500px' }}>
            <h2 className="admin-modal-title">Scan Verification QR</h2>
            <div id="reader" style={{ width: '100%' }}></div>
            <button onClick={() => setScanning(false)} className="admin-add-btn" style={{ marginTop: '20px', width: '100%' }}>
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminDashboard;
