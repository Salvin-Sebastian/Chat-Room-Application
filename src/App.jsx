import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not initialized, we will catch it here and handle gracefully
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="text-gradient" style={{ fontSize: '1.5rem' }}>Loading ChatVerse...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (activeRoom) {
    return <ChatRoom user={user} room={activeRoom} onBack={() => setActiveRoom(null)} />;
  }

  return <RoomList user={user} onSelectRoom={setActiveRoom} />;
}

export default App;
