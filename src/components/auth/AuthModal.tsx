import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm, SignupForm } from '.';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  console.log('AuthModal rendered. isOpen:', isOpen, 'initialMode prop:', initialMode);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  useEffect(() => {
    console.log('AuthModal useEffect: initialMode changed to', initialMode);
    setMode(initialMode);
  }, [initialMode]);

  const toggleMode = () => {
    setMode(prev => {
      const newMode = prev === 'login' ? 'signup' : 'login';
      console.log('toggleMode called. New internal mode:', newMode);
      return newMode;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div 
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={onClose}>
              <X size={20} />
            </button>
            
            <div className="auth-modal-header">
              <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>
                {mode === 'login' ? 'New to XploitEye?' : 'Already have an account?'}{' '}
                <button className="toggle-mode-button" onClick={toggleMode}>
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>

            <div className="auth-modal-body">
              {mode === 'login' ? <LoginForm /> : <SignupForm />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
