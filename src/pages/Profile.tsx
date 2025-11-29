import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      bio: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = (data: ProfileForm) => {
    // Simulate profile update
    setTimeout(() => {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>User Profile</h3>
              <button 
                className="btn btn-outline-primary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <div className="card-body">
              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {!isEditing ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Name:</strong></div>
                    <div className="col-sm-9">{user.name}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Email:</strong></div>
                    <div className="col-sm-9">{user.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Phone:</strong></div>
                    <div className="col-sm-9">+1 (555) 123-4567</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Bio:</strong></div>
                    <div className="col-sm-9">Full-stack developer with expertise in React and Node.js</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Member Since:</strong></div>
                    <div className="col-sm-9">{new Date(parseInt(user.id)).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                      })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      {...register('phone')}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      {...register('bio')}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Additional Profile Sections */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Account Settings</h5>
                </div>
                <div className="card-body">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                    <label className="form-check-label">Email notifications</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">SMS notifications</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                    <label className="form-check-label">Marketing emails</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Data Management</h5>
                </div>
                <div className="card-body">
                  <button className="btn btn-outline-primary btn-sm mb-2 w-100">
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </button>
                  <button className="btn btn-outline-warning btn-sm mb-2 w-100">
                    <i className="fas fa-key me-2"></i>
                    Change Password
                  </button>
                  <button className="btn btn-outline-danger btn-sm w-100">
                    <i className="fas fa-trash me-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;