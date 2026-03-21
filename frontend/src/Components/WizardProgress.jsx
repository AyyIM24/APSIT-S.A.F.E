import React from 'react';

const WizardProgress = ({ currentStep, stepLabels }) => {
  return (
    <div className="wizard-progress">
      {[1, 2, 3].map((step, i) => (
        <React.Fragment key={step}>
          <div className="wizard-step-block">
            <div className={`wizard-circle ${
              step < currentStep  ? 'done'   :
              step === currentStep ? 'active' : 'future'
            }`}>
              {step < currentStep ? '✓' : step}
            </div>
            <span className={`wizard-label ${step === currentStep ? 'active-label' : ''}`}>
              {stepLabels[i]}
            </span>
          </div>
          {i < 2 && (
            <div className="wizard-connector">
              <div className={`wizard-fill ${step < currentStep ? 'filled' : ''}`} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WizardProgress;
