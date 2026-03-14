import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const MyReports = ({ isLoggedIn, setIsLoggedIn }) => {
  // Sample data of items reported by the user
  const [myReports] = useState([
    { id: 1, name: "Blue HP Laptop", date: "2026-02-14", status: "Verified", location: "Library" },
    { id: 3, name: "APSIT ID Card", date: "2026-02-12", status: "Pending", location: "Lab 402" },
  ]);
  

  return (
    <div className="report-root">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="reports-page-container">
        <div className="reports-header">
          <h1>My <span>Reports</span></h1>
          <p>Track the status of items you've found on campus.</p>
        </div>

        <div className="table-container">
          <table className="aesthetic-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Date Reported</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myReports.map((report) => (
                <tr key={report.id}>
                  <td><strong>{report.name}</strong></td>
                  <td>{report.date}</td>
                  <td>{report.location}</td>
                  <td>
                    <span className={`status-pill ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-mini-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyReports;