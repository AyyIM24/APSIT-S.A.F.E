import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminShell from '../../Components/admin/AdminShell';
import api from '../../services/api';

const COLORS = ['#667eea', '#764ba2', '#a68ada', '#cdc6ea', '#120058', '#4facfe', '#00f2fe'];

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStatsData(response.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const lostCount = statsData?.totalLost || 0;
  const foundCount = statsData?.totalFound || 0;
  const pendingClaims = statsData?.pendingClaims || 0;
  const resolvedCount = statsData?.resolvedCount || 0;
  const securedCount = statsData?.securedCount || 0;

  const categoryData = statsData?.categoryData || [];
  
  // Create mock weekly data as we don't have this in the backend yet
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map(day => ({
    day,
    lost: Math.floor(Math.random() * 5),
    found: Math.floor(Math.random() * 4),
  }));

  const topLocations = statsData?.locationData?.slice(0, 4) || [];
  const maxLocCount = topLocations.length > 0 ? topLocations[0].count : 1;

  const total = statsData?.totalItems || 1;

  const stats = [
    { icon: '📦', label: 'Total Lost', count: lostCount, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: '🔍', label: 'Total Found', count: foundCount, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { icon: '⏳', label: 'Pending Claims', count: pendingClaims, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: '✅', label: 'Resolved', count: resolvedCount, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  ];

  useEffect(() => {
    if (scanning) {
      const scannerElement = document.getElementById("reader");
      if (!scannerElement) return;

      const scanner = new Html5QrcodeScanner("reader", { qrbox: { width: 250, height: 250 }, fps: 10 });
      scanner.render(success, error);

      async function success(result) {
        scanner.clear();
        setScanning(false);
        try {
          // Verify and auto-pickup for demonstration
          let token = result;
          if (result.includes("/")) {
            token = result.split("/").pop();
          }
          
          const verifyRes = await api.get(`/qr/verify/${token}`);
          if (verifyRes.data.valid) {
            alert(`Verified QR: Item ${verifyRes.data.itemName} claimed by ${verifyRes.data.claimedBy}. Marking as picked up...`);
            const pickupRes = await api.put(`/qr/pickup/${token}`);
            alert(pickupRes.data.message);
          } else {
            alert(`QR Invalid: ${verifyRes.data.message}`);
          }
        } catch (e) {
          alert("QR verification failed. " + (e.response?.data?.message || ""));
        }
      }

      function error(err) { /* silent */ }

      return () => {
        scanner.clear().catch(e => console.error(e));
      };
    }
  }, [scanning]);

  if (loading) {
    return <AdminShell pageTitle="Dashboard"><div style={{ padding: '20px' }}>Loading statistics...</div></AdminShell>;
  }

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
            {topLocations.map((locObj) => (
              <div className="admin-location-row" key={locObj.name}>
                <span className="admin-location-name">{locObj.name}</span>
                <div className="admin-location-bar-bg">
                  <div className="admin-location-bar-fill" style={{ width: `${(locObj.count / maxLocCount) * 100}%` }} />
                </div>
                <span className="admin-location-count">{locObj.count}</span>
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
