import React, { useEffect, useState, useRef } from 'react';
import Spinner from './Spinner';
import './ChatModal.css';
import { useToast } from '../AuthContext';

const ChatModal = ({ open, onClose, propertyId, broker, userId, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchMessages();
    // eslint-disable-next-line
  }, [open, propertyId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/messages/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
    } catch {}
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const body = { propertyId, content: input };
      if (userRole === 'admin') body.userId = userId;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(msgs => [...msgs, data]);
        setInput('');
        showToast('Message sent', 'success');
      } else {
        showToast(data.message || 'Failed to send message', 'error');
      }
    } catch {
      showToast('Failed to send message', 'error');
    }
    setSending(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!open) return null;
  return (
    <div className="chat-modal__overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>
        <div className="chat-modal__header">
          <span>Chat with Broker</span>
          <button className="chat-modal__close" onClick={onClose}>&times;</button>
        </div>
        <div className="chat-modal__body">
          {loading ? <Spinner /> : (
            <div className="chat-modal__messages">
              {messages.length === 0 ? (
                <div className="chat-modal__empty">No messages yet.</div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg._id}
                    className={`chat-modal__msg${msg.sender === userId ? ' chat-modal__msg--self' : ''}`}
                  >
                    <div className="chat-modal__msg-content">{msg.content}</div>
                    <div className="chat-modal__msg-meta">{new Date(msg.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <form className="chat-modal__input-row" onSubmit={handleSend}>
          <input
            className="chat-modal__input"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={sending}
          />
          <button className="chat-modal__send" type="submit" disabled={sending || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal; 