import React, { useState, useEffect, useRef } from 'react';
import { messagesRef, db } from '../firebase';
import { addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Send, ArrowLeft, Copy, Check } from 'lucide-react';

const BAD_WORDS = ['badword1', 'badword2', 'harassment', 'abuse', 'hate']; // Add actual words here later if needed
const cleanMessage = (text) => {
  let cleaned = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '*'.repeat(word.length));
  });
  return cleaned;
};

export default function ChatRoom({ user, room, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [copied, setCopied] = useState(false);
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

    let messageText = newMessage;
    setNewMessage('');
    
    // Filter harassment/profanity
    messageText = cleanMessage(messageText);

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="chat-layout glass-panel" style={{ marginTop: '5vh' }}>
      <div className="chat-header">
        <div className="flex items-center gap-4">
          <button className="btn-secondary" onClick={onBack} style={{ padding: '8px', border: 'none' }}>
            <ArrowLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2">
              <h2 style={{ margin: 0 }}>{room.name}</h2>
              {room.isPrivate && <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', padding: '2px 8px', borderRadius: '12px' }}>Private</span>}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm" style={{ opacity: 0.8 }}>Room ID: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', userSelect: 'all' }}>{room.id}</code></span>
              <button onClick={handleCopyId} title="Copy Room ID" className="btn-icon" style={{ width: '24px', height: '24px', padding: 0 }}>
                {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
              </button>
            </div>
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
