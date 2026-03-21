import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

/**
 * AdminQRView — PRD §11.6
 * QR code generator and print/download view for found items.
 */

const mockItems = [
  { id: 1, name: "Blue HP Laptop", location: "Library 2nd Floor", date: "2026-02-14", image: "/images/Img 1.jpg" },
  { id: 2, name: "iPhone 13", location: "Canteen", date: "2026-02-13", image: "/images/Img 2.jpg" },
  { id: 3, name: "APSIT ID Card", location: "Lab 402", date: "2026-02-12", image: "/images/Img 3.jpeg" },
  { id: 4, name: "Blue Umbrella", location: "Main Gate", date: "2026-02-11", image: "" },
  { id: 6, name: "Calculator", location: "Lab 401", date: "2026-02-09", image: "" },
];

const AdminQRView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const item = mockItems.find(i => i.id === parseInt(id));

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#120058' }}>
        <h2>Item Not Found</h2>
        <button className="admin-add-btn" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>← Go Back</button>
      </div>
    );
  }

  const qrUrl = `https://apsit-safe.edu.in/item/${item.id}`;

  const handleDownload = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const link = document.createElement('a');
      link.download = `item-${item.id}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="qr-modal-card qr-print-area" ref={printRef}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', marginBottom: '12px' }}
          />
        )}
        <h3 style={{ color: '#120058', fontWeight: 800, marginBottom: '4px', fontSize: '1.3rem' }}>{item.name}</h3>
        <p style={{ color: '#764ba2', fontSize: '14px', marginBottom: '24px' }}>
          📍 {item.location} · 📅 {item.date}
        </p>

        <div className="qr-wrapper">
          <QRCodeSVG
            value={qrUrl}
            size={200}
            fgColor="#120058"
            bgColor="#ffffff"
            level="H"
          />
        </div>

        <p style={{ color: '#764ba2', fontSize: '14px', marginTop: '20px', fontWeight: 600 }}>
          Scan to claim this item
        </p>
        <p style={{ color: '#120058', fontWeight: 800, fontSize: '16px', margin: '4px 0 0' }}>
          APSIT S.A.F.E
        </p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}
          className="no-print">
          <button className="admin-add-btn" onClick={() => window.print()}>🖨️ Print QR Label</button>
          <button className="export-btn" onClick={handleDownload}>📥 Download</button>
        </div>
        <div className="no-print" style={{ marginTop: '12px' }}>
          <button
            style={{ background: 'none', border: 'none', color: '#764ba2', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQRView;
