import React, { useEffect, useState } from 'react';
import { authService, type User } from '../services/authService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Notification from '../components/ui/Notification';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(!user);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const me = await authService.getCurrentUser();
        if (mounted) {
          setUser(me);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (!user) load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setNotification({ type: 'success', message: 'Logged out successfully', isVisible: true });
    // Optionally redirect after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 600);
  };

  return (
    <div className="container" style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      {notification.isVisible && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      )}

      <h1 style={{ marginBottom: '1rem' }}>Dashboard</h1>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LoadingSpinner />
          <span>Loading your data...</span>
        </div>
      ) : user ? (
        <div className="card" style={{ background: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <button className="auth-submit-button" style={{ marginTop: 16 }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Could not load user information.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
