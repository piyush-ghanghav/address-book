import React from 'react';

export default function ConfirmationModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Delete</button>
          <button onClick={onCancel} style={{ background: '#95a5a6' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
