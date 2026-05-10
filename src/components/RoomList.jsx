import React, { useState, useEffect } from 'react';
import { roomsRef, db, logout, getRoomRef } from '../firebase';
import { addDoc, serverTimestamp, query, orderBy, onSnapshot, getDoc } from 'firebase/firestore';
import { MessageSquarePlus, LogOut, Hash, Search, Lock, Globe } from 'lucide-react';

export default function RoomList({ user, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
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
        })).filter(room => !room.isPrivate); // Only show public rooms in the list
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
      const newRoom = await addDoc(roomsRef, {
        name: newRoomName.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        creatorName: user.displayName || 'Anonymous User',
        isPrivate: isPrivate
      });
      
      // If they create a private room, join it immediately
      if (isPrivate) {
        onSelectRoom({ id: newRoom.id, name: newRoomName.trim() });
      }
      
      setNewRoomName('');
      setIsPrivate(false);
    } catch (err) {
      console.error("Error creating room:", err);
      alert("Error creating room. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinById = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    try {
      setLoading(true);
      setSearchError('');
      const roomDoc = await getDoc(getRoomRef(searchId.trim()));
      
      if (roomDoc.exists()) {
        onSelectRoom({ id: roomDoc.id, ...roomDoc.data() });
        setSearchId('');
      } else {
        setSearchError('Room not found. Please check the ID.');
      }
    } catch (err) {
      console.error("Error finding room:", err);
      setSearchError('Invalid Room ID.');
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

        <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
          <form onSubmit={handleCreateRoom} className="flex-col gap-2" style={{ flex: '1', minWidth: '250px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Create new room..."
                maxLength={30}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px', minWidth: '50px' }}>
                <MessageSquarePlus size={20} />
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ cursor: 'pointer', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                checked={isPrivate} 
                onChange={(e) => setIsPrivate(e.target.checked)} 
                style={{ width: '16px', height: '16px' }}
              />
              {isPrivate ? <Lock size={14} /> : <Globe size={14} />}
              {isPrivate ? 'Make room Private (Hidden from list)' : 'Public room'}
            </label>
          </form>

          <form onSubmit={handleJoinById} className="flex-col gap-2" style={{ flex: '1', minWidth: '250px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Join by Room ID..."
                required
              />
              <button type="submit" className="btn-secondary" disabled={loading} style={{ padding: '12px', minWidth: '50px' }}>
                <Search size={20} />
              </button>
            </div>
            {searchError && <span style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '4px' }}>{searchError}</span>}
          </form>
        </div>

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
