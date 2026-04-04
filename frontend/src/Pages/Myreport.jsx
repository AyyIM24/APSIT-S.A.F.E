import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyReports = ({ isLoggedIn, setIsLoggedIn }) => {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/items/my-reports');
        setMyReports(response.data);
      } catch (err) {
        console.error("Failed to load your reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="report-root">
      <main className="reports-page-container">
        <div className="reports-header anim-slideDown">
          <h1>My <span>Reports</span></h1>
          <p>Track the status of items you've reported on campus.</p>
        </div>

        {loading && <div style={{ color: 'white', textAlign: 'center' }}>Loading your reports...</div>}
        
        {!loading && (
          <>
            {/* Stats — using actual backend statuses: LOST, FOUND, SECURED, RESOLVED */}
            <div style={{ 
              display: 'flex', gap: '16px', marginBottom: '30px', justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '20px 30px',
                textAlign: 'center', backdropFilter: 'blur(10px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{myReports.length}</div>
                <div style={{ color: '#a68ada', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Total Reports</div>
              </div>
              <div style={{ 
                background: 'rgba(40,167,69,0.1)', 
                border: '1px solid rgba(40,167,69,0.2)',
                borderRadius: '16px', padding: '20px 30px',
                textAlign: 'center', backdropFilter: 'blur(10px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2ecc71' }}>{myReports.filter(r => r.status === 'RESOLVED').length}</div>
                <div style={{ color: '#2ecc71', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Resolved</div>
              </div>
              <div style={{ 
                background: 'rgba(102,126,234,0.1)', 
                border: '1px solid rgba(102,126,234,0.2)',
                borderRadius: '16px', padding: '20px 30px',
                textAlign: 'center', backdropFilter: 'blur(10px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#667eea' }}>{myReports.filter(r => r.status === 'SECURED').length}</div>
                <div style={{ color: '#667eea', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Secured</div>
              </div>
              <div style={{ 
                background: 'rgba(255,193,7,0.1)', 
                border: '1px solid rgba(255,193,7,0.2)',
                borderRadius: '16px', padding: '20px 30px',
                textAlign: 'center', backdropFilter: 'blur(10px)',
                minWidth: '140px'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1c40f' }}>{myReports.filter(r => r.status === 'LOST' || r.status === 'FOUND').length}</div>
                <div style={{ color: '#f1c40f', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Active</div>
              </div>
            </div>

            <div className="table-container anim-cardReveal">
              <table className="aesthetic-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Date Reported</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myReports.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
                        No reports yet. Report a lost or found item to get started!
                      </td>
                    </tr>
                  )}
                  {myReports.map((report, index) => (
                    <tr key={report.id} style={{ animation: `cardReveal 0.4s ${index * 0.08}s ease both` }}>
                      <td><strong>{report.itemName}</strong></td>
                      <td>
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                          background: report.type?.toLowerCase() === 'lost' ? 'rgba(220,53,69,0.15)' : 'rgba(102,126,234,0.15)',
                          color: report.type?.toLowerCase() === 'lost' ? '#ff6b6b' : '#667eea',
                          border: `1px solid ${report.type?.toLowerCase() === 'lost' ? 'rgba(220,53,69,0.3)' : 'rgba(102,126,234,0.3)'}`
                        }}>
                          {report.type}
                        </span>
                      </td>
                      <td>{report.date}</td>
                      <td>{report.location}</td>
                      <td>
                        <span className={`status-pill ${report.status ? report.status.toLowerCase() : 'lost'}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-mini-btn" onClick={() => navigate(`/item/${report.id}`)}>View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyReports;