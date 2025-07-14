import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmText }) => {
  if (!open) return null;
  return (
    <div className="confirm-dialog__overlay">
      <div className="confirm-dialog">
        <h3 className="confirm-dialog__title">{title || 'Are you sure?'}</h3>
        <div className="confirm-dialog__message">{message}</div>
        <div className="confirm-dialog__actions">
          <button className="confirm-dialog__btn confirm-dialog__btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="confirm-dialog__btn confirm-dialog__btn--confirm" onClick={onConfirm}>{confirmText || 'Yes, Confirm'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 