import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import Captcha from '../components/Captcha';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const onSubmit = (data: RegisterForm) => {
    if (!captchaVerified) {
      setError('Please complete the security verification');
      return;
    }
    
    const result = registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Create Account</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
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
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>

                <Captcha onVerify={setCaptchaVerified} />

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={!captchaVerified}>
                  Create Account
                </button>
              </form>

              <div className="text-center">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;