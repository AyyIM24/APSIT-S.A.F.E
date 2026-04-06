import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WizardProgress from '../Components/WizardProgress';
import api from '../services/api';

const stepVariants = {
  enter:  dir => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeInOut' } },
  exit:   dir => ({ x: dir < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } }),
};

const Foundpage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    itemName: '', category: '', location: '',
    date: '', description: '', image: null,
    contactName: '', contactPhone: '', contactEmail: ''
  });

  // Validation per step
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.itemName.trim()) return 'Item name is required';
      if (!formData.category) return 'Category is required';
      if (!formData.date) return 'Date is required';
    }
    if (step === 2) {
      if (!formData.location.trim()) return 'Location is required';
    }
    if (step === 3) {
      if (!formData.contactName.trim()) return 'Your name is required';
      if (!formData.contactPhone.trim()) return 'Phone number is required';
      if (!formData.contactEmail.trim()) return 'Email is required';
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setSubmitError(error);
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }
    setSubmitError('');
    setDirection(1);
    setCurrentStep(s => s + 1);
  };
  const goBack = () => { setSubmitError(''); setDirection(-1); setCurrentStep(s => s - 1); };
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Validate step 3
    const error = validateStep(3);
    if (error) {
      setSubmitError(error);
      setTimeout(() => setSubmitError(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Upload image first if one was selected
      let imageUrl = null;
      if (formData.image) {
        try {
          const imgForm = new FormData();
          imgForm.append('file', formData.image);
          const uploadRes = await api.post('/upload', imgForm, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          imageUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.warn('Image upload failed, continuing without image:', uploadErr);
        }
      }

      // Create request payload mapped to backend ItemRequest
      const reqPayload = {
        itemName: formData.itemName,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        description: formData.description,
        imageUrl: imageUrl,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail
      };
      
      const response = await api.post('/items/found', reqPayload);
      console.log("Found item reported successfully", response.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to report found item", err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      setSubmitError(serverMsg || 'Failed to submit report. Please check all fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <h3>Thank You!</h3>
              <p>This item is now listed. The owner will reach out soon.</p>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                style={{ marginTop: '20px' }}
              >
                <button 
                  className="btn-gradient-card"
                  onClick={() => window.location.href = '/discovery'}
                  style={{ padding: '12px 30px' }}
                >
                  Return to Discovery Hub
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <h3>Report Found Item</h3>
              <p className="form-subtitle">Help reunite a student with their belonging.</p>

              <WizardProgress currentStep={currentStep} stepLabels={["Item Details", "Where You Found It", "Your Contact"]} />

              {/* Error Banner */}
              {submitError && (
                <div style={{
                  background: 'rgba(255,71,87,0.15)',
                  border: '1px solid rgba(255,71,87,0.3)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  marginBottom: '16px',
                  color: '#ff4757',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  ⚠️ {submitError}
                </div>
              )}

              {/* NO <form> wrapper — validation handled manually */}
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div key="step1" custom={direction} variants={stepVariants}
                    initial="enter" animate="center" exit="exit">
                    <div className="input-group">
                      <label>Item Name</label>
                      <input type="text" name="itemName" placeholder="e.g. Black Wallet" onChange={handleChange} value={formData.itemName} />
                    </div>
                    <div className="form-row">
                      <div className="input-group">
                        <label>💻 Category</label>
                        <select name="category" onChange={handleChange} value={formData.category}>
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
                        <label>📅 Found Date</label>
                        <input type="date" name="date" onChange={handleChange} value={formData.date} />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Description</label>
                      <textarea name="description" rows="3" placeholder="Describe the item..." onChange={handleChange} value={formData.description} />
                    </div>
                    <div className="upload-zone"
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); setFormData({...formData, image: e.dataTransfer.files[0]}); }}>
                      <div className="upload-icon">📷</div>
                      <p>Drag & drop image or <strong>browse</strong></p>
                      <input type="file" name="image" accept="image/*" className="file-input"
                        onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                      {formData.image && <img src={URL.createObjectURL(formData.image)} className="upload-preview" alt="preview" />}
                    </div>
                    <div className="btn-row">
                      <button type="button" className="btn-gradient-card" onClick={goNext}>Next → Location</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" custom={direction} variants={stepVariants}
                    initial="enter" animate="center" exit="exit">
                    <div className="input-group">
                      <label>📍 Location Found</label>
                      <input type="text" name="location" placeholder="e.g. Lab 402" onChange={handleChange} value={formData.location} />
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
                    <div className="btn-row">
                      <button type="button" className="btn-back" onClick={goBack}>← Back</button>
                      <button type="button" className="btn-gradient-card" onClick={goNext}>Next → Contact</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" custom={direction} variants={stepVariants}
                    initial="enter" animate="center" exit="exit">
                    <div className="input-group">
                      <label>👤 Your Name</label>
                      <input type="text" name="contactName" placeholder="e.g. Ayyan Muqadam" onChange={handleChange} value={formData.contactName} />
                    </div>
                    <div className="form-row">
                      <div className="input-group">
                        <label>📱 Phone Number</label>
                        <input type="text" name="contactPhone" placeholder="+91 XXXXXXXXXX" onChange={handleChange} value={formData.contactPhone} />
                      </div>
                      <div className="input-group">
                        <label>📧 Email Address</label>
                        <input type="email" name="contactEmail" placeholder="student@apsit.edu.in" onChange={handleChange} value={formData.contactEmail} />
                      </div>
                    </div>
                    <div className="confirm-check">
                      <input type="checkbox" id="confirm-found" />
                      <label htmlFor="confirm-found">I confirm this report is genuine</label>
                    </div>
                    <div className="confirm-check">
                      <input type="checkbox" id="safekeep" />
                      <label htmlFor="safekeep">I will keep this item safe until the owner is verified</label>
                    </div>
                    <div className="btn-row">
                      <button type="button" className="btn-back" onClick={goBack}>← Back</button>
                      <button type="button" className="submit-btn-gradient" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? '⏳ Submitting...' : '✓ Submit Report'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Foundpage;