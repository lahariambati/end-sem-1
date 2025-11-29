import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const Premium: React.FC = () => {
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      features: [
        'Basic Dashboard Access',
        'Email Support',
        'Standard Features',
        'Monthly Reports'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 19.99,
      popular: true,
      features: [
        'Advanced Dashboard',
        'Priority Chat Support',
        'All Premium Features',
        'Weekly Reports',
        'API Access',
        'Custom Integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      features: [
        'Full Enterprise Access',
        'Dedicated Support',
        'Custom Solutions',
        'Daily Reports',
        'Advanced Analytics',
        'Team Management'
      ]
    }
  ];

  const handlePurchase = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const processPayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      const subscription = {
        plan: selectedPlan?.id,
        planName: selectedPlan?.name,
        amount: selectedPlan?.price,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: `TXN${Date.now()}`
      };

      localStorage.setItem('userSubscription', JSON.stringify(subscription));
      setShowPayment(false);
      alert(`Successfully subscribed to ${selectedPlan?.name}!`);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to view premium plans.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h2>Choose Your Plan</h2>
        <p className="lead">Unlock advanced features and premium support</p>
      </div>

      <div className="row">
        {plans.map((plan) => (
          <div key={plan.id} className="col-md-4 mb-4">
            <div className={`card h-100 ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="card-header bg-primary text-white text-center">
                  <small>Most Popular</small>
                </div>
              )}
              <div className="card-body text-center">
                <h4 className="card-title">{plan.name}</h4>
                <div className="mb-3">
                  <span className="h2 text-primary">${plan.price}</span>
                  <span className="text-muted">/month</span>
                </div>
                <ul className="list-unstyled">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                <button 
                  className={`btn w-100 ${plan.popular ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handlePurchase(plan)}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment Gateway</h5>
                <button type="button" className="btn-close" onClick={() => setShowPayment(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <h4 className="text-success">${selectedPlan?.price}</h4>
                  <p className="text-muted">{selectedPlan?.name}</p>
                </div>
                
                <form>
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        value={paymentData.expiry}
                        onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button type="button" className="btn btn-success" onClick={processPayment}>
                      Pay ${selectedPlan?.price}
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPayment(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;