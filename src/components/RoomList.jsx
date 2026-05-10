import React, { useState, useEffect } from 'react';
import { roomsRef, db, logout } from '../firebase';
import { addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { MessageSquarePlus, LogOut, Hash } from 'lucide-react';

export default function RoomList({ user, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We try to catch errors if db is uninitialized or config is wrong
    if (!db) return;
    
    try {
      const q = query(roomsRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const roomsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRooms(roomsData);
      }, (err) => {
        console.error("Error fetching rooms:", err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Firestore error:", err);
    }
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      setLoading(true);
      await addDoc(roomsRef, {
        name: newRoomName.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        creatorName: user.displayName || 'Anonymous User'
      });
      setNewRoomName('');
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Error creating room. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="card glass-panel" style={{ maxWidth: '600px' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-gradient">Chat Rooms</h2>
            <p className="text-sm">Welcome, {user.displayName || 'Guest'}</p>
          </div>
          <button className="btn-secondary" onClick={logout} title="Logout" style={{ padding: '8px' }}>
            <LogOut size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateRoom} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="New room name..."
            maxLength={30}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px', minWidth: '50px' }}>
            <MessageSquarePlus size={20} />
          </button>
        </form>

        <div className="flex-col gap-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {rooms.length === 0 ? (
            <div className="text-center text-sm mt-4">
              <p>No chat rooms found. Create one!</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div 
                key={room.id} 
                className="glass-panel flex justify-between items-center" 
                style={{ padding: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => onSelectRoom(room)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="flex items-center gap-4">
                  <div className="btn-icon" style={{ width: '40px', height: '40px' }}>
                    <Hash size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{room.name}</h3>
                    <span className="text-sm">Created by {room.creatorName}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
