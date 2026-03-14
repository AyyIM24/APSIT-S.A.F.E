import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const ReportItem = ({ isLoggedIn, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    location: '',
    date: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item Reported:", formData);
    alert("Item reported successfully! AIM, check the console for data.");
  };

  return (
    <div className="report-root">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="report-container">
        <div className="report-form-box">
            <h3>Report Lost Item</h3>
          <p className="form-subtitle">Help reunite a student with their belonging.</p>

          <form onSubmit={handleSubmit} className="actual-form">
            <div className="input-group">
              <label>Item Name</label>
              <input 
                type="text" name="itemName" placeholder="e.g. Blue HP Laptop" 
                required onChange={handleChange} 
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Category</label>
                <select name="category" required onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="id-cards">ID Cards</option>
                  <option value="books">Books/Notes</option>
                </select>
              </div>

              <div className="input-group">
                <label>Lost Date</label>
                <input type="date" name="date" required onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Location (Campus Area)</label>
              <input 
                type="text" name="location" placeholder="e.g. Lab 402 or Canteen" 
                required onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea 
                name="description" rows="4" 
                placeholder="Describe any identifying marks..." 
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="input-group">
              <label className="file-label">
                Upload Image
                <br />
                <br />
                <input type="file" name="image" className="file-input" />
              </label>
            </div>

            <div className='info'>
            <label>Contact Information</label>
            </div>
            <div className="input-group-2">
              <input type="text" name="Name" placeholder="Your Name" 
                required onChange={handleChange} />
              <br/>
              <input type="text" name="contact" placeholder="Your Phone"
                required onChange={handleChange}/>
              <br/>
              <input type="email" name="email" placeholder="Your Email"
                 required onChange={handleChange}/>
              <br/>
            </div>

            <button type="submit" className="submit-btn-gradient">
              Submit Report
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportItem;