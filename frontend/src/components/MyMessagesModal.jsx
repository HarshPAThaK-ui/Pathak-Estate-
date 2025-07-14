import React, { useEffect, useState } from 'react';
import './MyMessagesModal.css';
import Spinner from './Spinner';
import ChatModal from './ChatModal';
import { useAuth } from '../AuthContext';

const MyMessagesModal = ({ open, onClose }) => {
  const [conversations, setConversations] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeProperty, setActiveProperty] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchConversations();
    // eslint-disable-next-line
  }, [open]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setConversations(data);
    } catch {}
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="mymessages-modal__overlay" onClick={onClose}>
      <div className="mymessages-modal" onClick={e => e.stopPropagation()}>
        <div className="mymessages-modal__header">
          <span>My Messages</span>
          <button className="mymessages-modal__close" onClick={onClose}>&times;</button>
        </div>
        <div className="mymessages-modal__body">
          {loading ? <Spinner /> : (
            Object.keys(conversations).length === 0 ? (
              <div className="mymessages-modal__empty">No conversations yet.</div>
            ) : (
              <div className="mymessages-modal__list">
                {Object.entries(conversations).map(([propertyId, msgs]) => {
                  const lastMsg = msgs[msgs.length - 1];
                  const property = lastMsg.property;
                  return (
                    <div
                      key={propertyId}
                      className="mymessages-modal__item"
                      onClick={() => setActiveProperty({ property, propertyId })}
                    >
                      <div className="mymessages-modal__item-title">{property.title || property.name}</div>
                      <div className="mymessages-modal__item-last">{lastMsg.content}</div>
                      <div className="mymessages-modal__item-meta">{new Date(lastMsg.createdAt).toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
        {activeProperty && (
          <ChatModal
            open={!!activeProperty}
            onClose={() => setActiveProperty(null)}
            propertyId={activeProperty.propertyId}
            broker={activeProperty.property.broker}
            userId={user?._id}
            userRole={user?.role}
          />
        )}
      </div>
    </div>
  );
};

export default MyMessagesModal; 