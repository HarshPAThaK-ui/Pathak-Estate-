import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  return (
    <div className={`toast toast--${type}`}> 
      <span className="toast__icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
};

export default Toast; 