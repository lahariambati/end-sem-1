import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = (data: LoginForm) => {
    const result = login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Login</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit(onSubmit)}>
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

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Login
                </button>
              </form>

              <div className="text-center">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <h6>Demo Credentials:</h6>
                <p className="mb-1"><strong>Email:</strong> demo@example.com</p>
                <p className="mb-0"><strong>Password:</strong> demo123</p>
                <small className="text-muted">Or register a new account</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;