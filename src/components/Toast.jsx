import React from 'react';

export default function Toast({ toast, onClose, onRetry }) {
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type || 'info'}`} role="status">
      <div>
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <div className="toast-actions">
        {toast.retry && <button type="button" onClick={onRetry}>Retry</button>}
        <button type="button" aria-label="Close notification" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
