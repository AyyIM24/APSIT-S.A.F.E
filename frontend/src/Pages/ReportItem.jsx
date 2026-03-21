import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardProgress from '../Components/WizardProgress';

const stepVariants = {
  enter:  dir => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeInOut' } },
  exit:   dir => ({ x: dir < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } }),
};

const ReportItem = ({ isLoggedIn, setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '', category: '', location: '',
    date: '', description: '', image: null,
    contactName: '', contactPhone: '', contactEmail: ''
  });

  const goNext = () => { setDirection(1);  setCurrentStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setCurrentStep(s => s - 1); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item Reported:", formData);
    setSubmitted(true);
  };

  return (
    <div className="report-root">
      <main className="report-container">
        <div className="report-form-box">

          {submitted ? (
            <motion.div className="success-state"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div className="success-icon">✅</div>
              <h3>Report Submitted!</h3>
              <p>We'll notify you when someone finds your item.</p>
            </motion.div>
          ) : (
            <>
              <h3>Report Lost Item</h3>
              <p className="form-subtitle">Help reunite a student with their belonging.</p>

              <WizardProgress currentStep={currentStep} stepLabels={["Item Details", "Location & Date", "Contact & Submit"]} />

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait" custom={direction}>
                  {currentStep === 1 && (
                    <motion.div key="step1" custom={direction} variants={stepVariants}
                      initial="enter" animate="center" exit="exit">
                      <div className="input-group">
                        <label>Item Name</label>
                        <input type="text" name="itemName" placeholder="e.g. Blue HP Laptop" required onChange={handleChange} value={formData.itemName} />
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>💻 Category</label>
                          <select name="category" required onChange={handleChange} value={formData.category}>
                            <option value="">Select Category</option>
                            <option value="electronics">💻 Electronics</option>
                            <option value="id-cards">🪪 ID Cards</option>
                            <option value="books">📚 Books/Notes</option>
                            <option value="bags">🎒 Bags</option>
                            <option value="accessories">⌚ Accessories</option>
                            <option value="keys">🔑 Keys</option>
                            <option value="other">👓 Other</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>📅 Lost Date</label>
                          <input type="date" name="date" required onChange={handleChange} value={formData.date} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" rows="3" placeholder="Describe any identifying marks..." onChange={handleChange} value={formData.description} />
                      </div>
                      <div className="upload-zone"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); setFormData({...formData, image: e.dataTransfer.files[0]}); }}>
                        <div className="upload-icon">📷</div>
                        <p>Drag & drop image or <strong>browse</strong></p>
                        <input type="file" name="image" className="file-input"
                          onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                        {formData.image && <img src={URL.createObjectURL(formData.image)} className="upload-preview" alt="preview" />}
                      </div>
                      <div className="btn-row">
                        <button type="button" className="btn-gradient-card" onClick={goNext}>Next → Location & Date</button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" custom={direction} variants={stepVariants}
                      initial="enter" animate="center" exit="exit">
                      <div className="input-group">
                        <label>📍 Campus Location</label>
                        <input type="text" name="location" placeholder="e.g. Lab 402" required onChange={handleChange} value={formData.location} />
                      </div>
                      <div className="input-group">
                        <label>🗺️ Select Campus Zone</label>
                        <div className="campus-zone-grid">
                          {['Library 1st Floor','Library 2nd Floor','Canteen','Lab 401','Lab 402','Lab 403','Seminar Hall','Reception','Parking Lot','Sports Ground','Main Gate','Class Block A','Class Block B','Class Block C','Other'].map(zone => (
                            <button key={zone} type="button"
                              className={`zone-btn ${formData.location === zone ? 'zone-active' : ''}`}
                              onClick={() => setFormData({...formData, location: zone})}>{zone}</button>
                          ))}
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Additional Hint (optional)</label>
                        <input type="text" name="locationHint" placeholder="e.g. Near the window seat" onChange={handleChange} />
                      </div>
                      <div className="btn-row">
                        <button type="button" className="btn-back" onClick={goBack}>← Back</button>
                        <button type="button" className="btn-gradient-card" onClick={goNext}>Next → Contact Info</button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" custom={direction} variants={stepVariants}
                      initial="enter" animate="center" exit="exit">
                      <div className="input-group">
                        <label>👤 Your Name</label>
                        <input type="text" name="contactName" placeholder="e.g. Ayyan Muqadam" required onChange={handleChange} value={formData.contactName} />
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>📱 Phone Number</label>
                          <input type="text" name="contactPhone" placeholder="+91 8591XXXXXX" required onChange={handleChange} value={formData.contactPhone} />
                        </div>
                        <div className="input-group">
                          <label>📧 Email Address</label>
                          <input type="email" name="contactEmail" placeholder="student@apsit.edu.in" required onChange={handleChange} value={formData.contactEmail} />
                        </div>
                      </div>
                      <div className="confirm-check">
                        <input type="checkbox" id="confirm-lost" required />
                        <label htmlFor="confirm-lost">I confirm this report is genuine and accurate</label>
                      </div>
                      <div className="btn-row">
                        <button type="button" className="btn-back" onClick={goBack}>← Back</button>
                        <button type="submit" className="submit-btn-gradient">✓ Submit Report</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportItem;