/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "./modal.css";
import successIcon from "../../assets/success.svg";
import errorIcon from "../../assets/error.svg";
import pendingIcon from "../../assets/pending.svg";
import expiredIcon from "../../assets/expired.svg"; // Add an icon for the "expired" state

const Modal = ({
  isOpen,
  title,
  message,
  amount,
  orderId,
  utr, lang,
  redirectUrl,
  type = "SUCCESS",
  onClose,
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    let timer;
    if (redirectUrl) {
      timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [redirectUrl]);

  const defaultMessages = {
    processing: lang.processing,
    dispute: lang.dispute,
    duplicate: lang.duplicate,
    failed: lang.failed,
    expired: lang.expired,
    success: lang.success,
  };
  
  const statusConfig = {
    SUCCESS: {
      icon: successIcon,
      defaultMessage: defaultMessages.success,
      themeClass: "success-theme",
    },
    PENDING: {
      icon: pendingIcon,
      defaultMessage: defaultMessages.processing,
      themeClass: "pending-theme",
    },
    IMG_PENDING: {
      icon: pendingIcon,
      defaultMessage: defaultMessages.processing,
      themeClass: "pending-theme",
    },
    DUPLICATE: {
      icon: pendingIcon,
      defaultMessage: defaultMessages.processing,
      themeClass: "pending-theme",
    },
    DISPUTE: {
      icon: errorIcon,
      defaultMessage: defaultMessages.dispute,
      themeClass: "error-theme",
    },
    BANK_MISMATCH: {
      icon: errorIcon,
      defaultMessage: defaultMessages.processing,
      themeClass: "error-theme",
    },
    FAILED: {
      icon: errorIcon,
      defaultMessage: defaultMessages.failed,
      themeClass: "error-theme",
    },
    EXPIRED: {
      icon: expiredIcon,
      defaultMessage: defaultMessages.expired,
      themeClass: "expired-theme",
    },
  };  

  const currentStatus = statusConfig[type] || statusConfig.SUCCESS;
  const displayMessage = message || currentStatus.defaultMessage;

  return (
    <div className="modal-overlay" data-testid="modal-overlay">
      <div className={`modal-container ${currentStatus.themeClass}`} data-testid="modal-container">
        <div className="modal-card">
          <div className="modal-header">
            <div className="status-icon">
              <img src={currentStatus.icon} alt={type} className="status-image" />
            </div>
            <h2 className="modal-title">{title || type}</h2>
            {onClose && (
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            )}
          </div>
          <div className="modal-content">
            {amount && (
              <div className="amount-display">
                <span className="amount-label">{lang.amount}:</span>
                <span className="amount-value">₹{amount}</span>
              </div>
            )}
            <p className="modal-message">{displayMessage}</p>
            {(orderId || utr) && (
              <div className="transaction-details">
                {orderId && (
                  <div className="detail-item">
                    <span className="detail-label">{lang.orderId}:</span>
                    <span className="detail-value">{orderId}</span>
                  </div>
                )}
                {utr && (
                  <div className="detail-item">
                    <span className="detail-label">{lang.utr}.</span>
                    <span className="detail-value">{utr}</span>
                  </div>
                )}
              </div>
            )}
            {redirectUrl && (
              <p className="redirect-notice">{lang.redirecting}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;