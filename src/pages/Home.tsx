import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="text-center mb-5">
            <h1 className="display-4 mb-4">SkillEnd Semester Exam</h1>
            <p className="lead">
              Complete React Application with All Required Features
            </p>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-palette fa-3x text-primary mb-3"></i>
                  <h5>UI/UX Design</h5>
                  <p>Modern Bootstrap interface with responsive design and visual aesthetics</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-route fa-3x text-success mb-3"></i>
                  <h5>Routing & Navigation</h5>
                  <p>React Router implementation with protected routes and navigation</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-check-circle fa-3x text-info mb-3"></i>
                  <h5>Form Validation</h5>
                  <p>React Hook Form with real-time validation and error handling</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-user-shield fa-3x text-warning mb-3"></i>
                  <h5>Authentication</h5>
                  <p>Complete login/register system with session management</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-api fa-3x text-danger mb-3"></i>
                  <h5>API Integration</h5>
                  <p>Axios implementation with external API calls and data fetching</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="fas fa-database fa-3x text-secondary mb-3"></i>
                  <h5>CRUD Operations</h5>
                  <p>Complete Create, Read, Update, Delete functionality</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg me-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg me-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="row mt-5">
            <div className="col-md-6">
              <h4>Advanced Features</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">💳 Payment Gateway Integration</li>
                <li className="list-group-item">🔒 CAPTCHA Security</li>
                <li className="list-group-item">💬 Real-time Chat System</li>
                <li className="list-group-item">📊 Interactive Dashboard</li>
                <li className="list-group-item">💾 Data Persistence</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h4>Technical Implementation</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">⚛️ React with TypeScript</li>
                <li className="list-group-item">🎨 Bootstrap 5 Styling</li>
                <li className="list-group-item">🔄 Context API State Management</li>
                <li className="list-group-item">📱 Responsive Design</li>
                <li className="list-group-item">🚀 Production Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;