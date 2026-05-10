import React, { useState } from 'react';
import { loginWithGoogle, loginAnonymously } from '../firebase';
import { LogIn, User } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginAnonymously();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to login anonymously.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card glass-panel text-center">
        <div style={{ marginBottom: '20px' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ChatVerse</h1>
          <p className="text-sm">Connect with anyone, anywhere.</p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div className="flex-col gap-4 mt-4">
          <button 
            className="btn-primary" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? 'Connecting...' : 'Sign in with Google'}
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleAnonymousLogin}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <User size={20} />
            Continue as Guest
          </button>
        </div>
        
        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <p>Please make sure you have added your Firebase config in the .env file.</p>
        </div>
      </div>
    </div>
  );
}
