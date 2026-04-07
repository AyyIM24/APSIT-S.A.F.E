import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
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
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'processing' | 'success' | 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef(null);

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
  }, [scanning, scanMode]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('processing');
    setUploadMessage('Processing file...');

    // Check if it's a PDF
    if (file.type === 'application/pdf') {
      setUploadStatus('error');
      setUploadMessage('PDF uploaded. Please extract the QR code image from the PDF and upload it as an image (JPG, PNG) instead.');
      return;
    }

    // For image files, use Html5Qrcode to scan
    try {
      const html5QrCode = new Html5Qrcode('upload-reader');
      const result = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();

      setUploadStatus('success');
      setUploadMessage('QR Code detected! Verifying...');

      // Process the QR result
      try {
        let token = result;
        if (result.includes('/')) {
          token = result.split('/').pop();
        }

        const verifyRes = await api.get(`/qr/verify/${token}`);
        if (verifyRes.data.valid) {
          alert(`Verified QR: Item ${verifyRes.data.itemName} claimed by ${verifyRes.data.claimedBy}. Marking as picked up...`);
          const pickupRes = await api.put(`/qr/pickup/${token}`);
          alert(pickupRes.data.message);
        } else {
          alert(`QR Invalid: ${verifyRes.data.message}`);
        }
      } catch (err) {
        alert('QR verification failed. ' + (err.response?.data?.message || ''));
      }

      setScanning(false);
      setUploadStatus(null);
    } catch (err) {
      setUploadStatus('error');
      setUploadMessage('No QR code found in this image. Please try another image.');
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
          <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
            <h2 className="admin-modal-title">Scan Verification QR</h2>

            {/* Tab Switcher */}
            <div style={{
              display: 'flex', gap: '0', marginBottom: '20px', borderRadius: '12px',
              overflow: 'hidden', border: '1px solid rgba(118,75,162,0.25)',
            }}>
              <button
                onClick={() => { setScanMode('camera'); setUploadStatus(null); }}
                style={{
                  flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  fontSize: '14px', transition: 'all 0.3s ease',
                  background: scanMode === 'camera'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255,255,255,0.06)',
                  color: scanMode === 'camera' ? 'white' : 'rgba(255,255,255,0.6)',
                }}
              >
                📷 Camera Scan
              </button>
              <button
                onClick={() => { setScanMode('upload'); setUploadStatus(null); }}
                style={{
                  flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  fontSize: '14px', transition: 'all 0.3s ease',
                  background: scanMode === 'upload'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(255,255,255,0.06)',
                  color: scanMode === 'upload' ? 'white' : 'rgba(255,255,255,0.6)',
                }}
              >
                📤 Upload File
              </button>
            </div>

            {/* Camera Scanner */}
            {scanMode === 'camera' && (
              <div id="reader" style={{ width: '100%' }}></div>
            )}

            {/* File Upload */}
            {scanMode === 'upload' && (
              <div style={{ textAlign: 'center' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(118,75,162,0.4)',
                    borderRadius: '20px', padding: '40px 20px', cursor: 'pointer',
                    background: 'rgba(118,75,162,0.06)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#764ba2'; e.currentTarget.style.background = 'rgba(118,75,162,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(118,75,162,0.4)'; e.currentTarget.style.background = 'rgba(118,75,162,0.06)'; }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📁</div>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
                    Click to upload QR Code image
                  </p>
                  <p style={{ fontSize: '13px', opacity: 0.6 }}>
                    Supports: JPG, PNG, GIF, BMP, PDF
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {/* Hidden div for Html5Qrcode file scanning */}
                <div id="upload-reader" style={{ display: 'none' }}></div>

                {/* Upload Status */}
                {uploadStatus && (
                  <div style={{
                    marginTop: '16px', padding: '14px 18px', borderRadius: '14px', fontWeight: 600, fontSize: '14px',
                    background: uploadStatus === 'processing' ? 'rgba(102,126,234,0.15)'
                      : uploadStatus === 'success' ? 'rgba(40,167,69,0.15)'
                      : 'rgba(255,75,75,0.12)',
                    color: uploadStatus === 'processing' ? '#667eea'
                      : uploadStatus === 'success' ? '#2ecc71'
                      : '#ff6b6b',
                    border: `1px solid ${uploadStatus === 'processing' ? 'rgba(102,126,234,0.25)'
                      : uploadStatus === 'success' ? 'rgba(40,167,69,0.3)'
                      : 'rgba(255,75,75,0.25)'}`,
                  }}>
                    {uploadStatus === 'processing' && '⏳ '}
                    {uploadStatus === 'success' && '✅ '}
                    {uploadStatus === 'error' && '❌ '}
                    {uploadMessage}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => { setScanning(false); setScanMode('camera'); setUploadStatus(null); }}
              className="admin-add-btn"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminDashboard;
