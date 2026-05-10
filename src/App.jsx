import React, { useState, useEffect } from 'react';
import { auth, getRoomRef } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
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

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check for room invite in URL
        const params = new URLSearchParams(window.location.search);
        const roomId = params.get('room');
        
        if (roomId) {
          try {
            const roomDoc = await getDoc(getRoomRef(roomId));
            if (roomDoc.exists()) {
              setActiveRoom({ id: roomDoc.id, ...roomDoc.data() });
              // Clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname);
            } else {
              alert("The invite link is invalid or the room was deleted.");
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (err) {
            console.error("Error fetching invite room:", err);
          }
        }
      }
      
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
