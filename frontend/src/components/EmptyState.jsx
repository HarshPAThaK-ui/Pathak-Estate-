import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '📭', message, children }) => (
  <div className="empty-state">
    <div className="empty-state__icon">{icon}</div>
    <div className="empty-state__message">{message}</div>
    {children && <div className="empty-state__actions">{children}</div>}
  </div>
);

export default EmptyState; 