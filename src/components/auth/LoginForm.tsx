import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authService, type LoginData } from '../../services/authService';
import LoadingSpinner from '../ui/LoadingSpinner';
import Notification from '../ui/Notification';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload: LoginData = {
        identifier: formData.identifier.trim(),
        password: formData.password,
      };

      const res = await authService.signin(payload);

      if (res.success) {
        setNotification({ type: 'success', message: res.message || 'Login successful', isVisible: true });
        // Optionally clear form
        setFormData({ identifier: '', password: '' });
      } else {
        setNotification({ type: 'error', message: res.message || 'Invalid credentials', isVisible: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ type: 'error', message: 'Network error. Please try again.', isVisible: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      className="auth-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {notification.isVisible && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      )}
      <div className="form-group">
        <label htmlFor="identifier">Email or Username</label>
        <div className="input-with-icon">
          <Mail size={18} className="input-icon" />
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Enter your email or username"
            value={formData.identifier}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="password-label-row">
          <label htmlFor="password">Password</label>
          <a href="#forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>
        <div className="input-with-icon">
          <Lock size={18} className="input-icon" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button 
            type="button" 
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        className="auth-submit-button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
      >
        {isLoading ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <LoadingSpinner size="small" text="" />
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </motion.button>
    </motion.form>
  );
}
