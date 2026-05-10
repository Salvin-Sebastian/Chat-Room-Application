import React, { useState, useEffect, useRef } from 'react';
import { messagesRef, db } from '../firebase';
import { addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Send, ArrowLeft } from 'lucide-react';

export default function ChatRoom({ user, room, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!db || !room) return;

    try {
      const q = query(messagesRef(room.id), orderBy('createdAt', 'asc'), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
        
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Firestore error:", err);
    }
  }, [room]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      await addDoc(messagesRef(room.id), {
        text: messageText,
        createdAt: serverTimestamp(),
        uid: user.uid,
        displayName: user.displayName || 'Anonymous User'
      });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message.");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-layout glass-panel" style={{ marginTop: '5vh' }}>
      <div className="chat-header">
        <div className="flex items-center gap-4">
          <button className="btn-secondary" onClick={onBack} style={{ padding: '8px', border: 'none' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 style={{ margin: 0 }}>{room.name}</h2>
            <span className="text-sm">Chatting as {user.displayName || 'Guest'}</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-sm">
            <p>No messages yet. Be the first to say hi!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.uid === user.uid;
            return (
              <div key={msg.id} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                {!isMe && <span className="message-sender">{msg.displayName}</span>}
                <div style={{ marginBottom: '4px' }}>{msg.text}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.7, textAlign: 'right' }}>
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength={500}
        />
        <button type="submit" className="btn-icon" disabled={!newMessage.trim()}>
          <Send size={20} style={{ marginLeft: '-2px' }} />
        </button>
      </form>
    </div>
  );
}
