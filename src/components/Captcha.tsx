import React, { useState, useEffect } from 'react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [verified, setVerified] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setUserInput('');
    setVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const verifyCaptcha = () => {
    const isValid = userInput.toLowerCase() === captcha.toLowerCase();
    setVerified(isValid);
    onVerify(isValid);
    if (!isValid) {
      generateCaptcha();
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">Security Verification</label>
      <div className="card p-3">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div 
              className="text-center p-2 bg-light border rounded"
              style={{
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '3px',
                textDecoration: 'line-through',
                color: '#333'
              }}
            >
              {captcha}
            </div>
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className={`form-control ${verified ? 'is-valid' : userInput && !verified ? 'is-invalid' : ''}`}
              placeholder="Enter captcha"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verifyCaptcha()}
            />
          </div>
          <div className="col-md-3">
            <button 
              type="button" 
              className="btn btn-outline-primary btn-sm me-1"
              onClick={verifyCaptcha}
            >
              Verify
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-sm"
              onClick={generateCaptcha}
            >
              ↻
            </button>
          </div>
        </div>
        {verified && (
          <div className="text-success mt-2">
            <i className="fas fa-check-circle me-1"></i>
            Verification successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default Captcha;