import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getClassName = () => {
    const baseClass = 'notification';
    switch (type) {
      case 'success':
        return `${baseClass} notification-success`;
      case 'error':
        return `${baseClass} notification-error`;
      case 'warning':
        return `${baseClass} notification-warning`;
      default:
        return baseClass;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={getClassName()}
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {getIcon()}
            </div>
            <span className="notification-message">{message}</span>
            <button
              className="notification-close"
              onClick={onClose}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
