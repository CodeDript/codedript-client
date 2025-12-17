import React from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.css';

interface Props {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({ open, title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', loading = false, onConfirm, onCancel }) => {
  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  const jsx = (
    <div className={styles.backdrop} onClick={handleBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.body}>{message}</div>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>{cancelText}</button>
          <button className={styles.confirm} onClick={onConfirm} disabled={loading}>{loading ? 'Processing...' : confirmText}</button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return jsx;
  return createPortal(jsx, document.body);
};

export default ConfirmModal;