import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    revenue: 0
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load dashboard data
    loadDashboardData();
    loadRecentActivities();
  }, []);

  const loadDashboardData = () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        activeProjects: 45,
        completedTasks: 892,
        revenue: 15750
      });
    }, 500);
  };

  const loadRecentActivities = () => {
    const mockActivities = [
      { id: 1, action: 'User registered', time: '2 minutes ago', type: 'user' },
      { id: 2, action: 'Payment processed', time: '5 minutes ago', type: 'payment' },
      { id: 3, action: 'New message received', time: '10 minutes ago', type: 'message' },
      { id: 4, action: 'Profile updated', time: '15 minutes ago', type: 'profile' }
    ];
    setActivities(mockActivities);
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to access the dashboard.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Welcome back, {user.name}!</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalUsers}</h4>
                  <p className="mb-0">Total Users</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.activeProjects}</h4>
                  <p className="mb-0">Active Projects</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-project-diagram fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.completedTasks}</h4>
                  <p className="mb-0">Completed Tasks</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>${stats.revenue}</h4>
                  <p className="mb-0">Revenue</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-dollar-sign fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Quick Actions */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Link to="/chat" className="btn btn-outline-primary w-100">
                    <i className="fas fa-comments me-2"></i>
                    Open Chat
                  </Link>
                </div>
                <div className="col-md-6 mb-3">
                  <Link to="/premium" className="btn btn-outline-success w-100">
                    <i className="fas fa-crown me-2"></i>
                    Upgrade to Premium
                  </Link>
                </div>
                <div className="col-md-6 mb-3">
                  <Link to="/profile" className="btn btn-outline-info w-100">
                    <i className="fas fa-user me-2"></i>
                    Edit Profile
                  </Link>
                </div>
                <div className="col-md-6 mb-3">
                  <button className="btn btn-outline-warning w-100">
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities</h5>
            </div>
            <div className="card-body">
              {activities.map(activity => (
                <div key={activity.id} className="d-flex align-items-center mb-3">
                  <div className={`badge ${
                    activity.type === 'user' ? 'bg-primary' : 
                    activity.type === 'payment' ? 'bg-success' : 
                    activity.type === 'message' ? 'bg-info' : 'bg-warning'
                  } me-2`}>
                    <i className={`fas ${
                      activity.type === 'user' ? 'fa-user' : 
                      activity.type === 'payment' ? 'fa-dollar-sign' : 
                      activity.type === 'message' ? 'fa-envelope' : 'fa-edit'
                    }`}></i>
                  </div>
                  <div>
                    <div className="fw-bold">{activity.action}</div>
                    <small className="text-muted">{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;