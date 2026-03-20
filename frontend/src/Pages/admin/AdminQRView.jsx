import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

const AdminQRView = ({ item, onClose }) => {
  const qrCardRef = useRef(null);

  const qrUrl = `https://apsit-safe.edu.in/item/${item.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!qrCardRef.current) return;
    try {
      const canvas = await html2canvas(qrCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `item-${item.id}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="qr-modal-card" ref={qrCardRef} onClick={(e) => e.stopPropagation()}>
        {item.image && (
          <div style={{
            width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden',
            margin: '0 auto 12px', boxShadow: '0 4px 15px rgba(18,0,88,0.15)'
          }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <h3>{item.name}</h3>
        <p>📍 {item.location} · 📅 {item.date}</p>

        <div className="qr-wrapper" style={{ margin: '20px auto' }}>
          <QRCodeCanvas
            value={qrUrl}
            size={200}
            fgColor="#120058"
            bgColor="#ffffff"
            level="H"
          />
        </div>

        <p style={{ fontSize: '15px', color: '#120058', fontWeight: '600' }}>
          Scan to claim this item
        </p>
        <p style={{ fontSize: '12px', color: '#a68ada', fontWeight: '700', letterSpacing: '1px' }}>
          APSIT S.A.F.E
        </p>

        <div className="qr-btn-row">
          <button className="qr-btn-primary" onClick={handlePrint}>🖨️ Print Label</button>
          <button className="qr-btn-outline" onClick={handleDownload}>⬇️ Download</button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '12px', background: 'none', border: 'none',
            color: '#764ba2', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminQRView;
