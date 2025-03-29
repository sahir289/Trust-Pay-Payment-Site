/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "./modal.css";
import success from "../../assets/success.png";
import error from "../../assets/success.png";
import pending from "../../assets/success.png"; // Add pending icon

const Modal = ({ 
  isOpen, 
  title, 
  message,
  amount, 
  orderId, 
  utr, 
  redirectUrl, 
  theme = "green-theme",
  type = "success" // success, error, or pending
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  const getIcon = (type) => {
    switch(type) {
      case 'SUCCESS':
        return success;
      case 'PENDING':
        return pending;
      case 'FAILED':
        return error;
      default:
        return success;
    }
  };

  const getDefaultMessage = (type) => {
    switch(type) {
      case 'SUCCESS':
        return 'Your payment has been successfully processed. Points will be credited shortly.';
      case 'PENDING':
        return 'Your payment is being processed. Please wait while we verify the transaction.';
      case 'FAILED':
        return 'Payment failed. Please try again with correct details.';
      case 'DROPPED':
        return 'Payment was dropped. Please try initiating a new transaction.';
      case 'BANK_MISMATCH':
        return 'Bank account details do not match. Please verify and try again.';
      case 'DISPUTE':
        return 'Transaction is under dispute. Our team will contact you shortly.';
      case 'DUPLICATE':
        return 'Transaction is a duplicate. Please try again.';
      default:
        return message || 'Something went wrong. Please try again.';
    }
  };

  return (
    <>
      <div className="fixed top-0 bg-white bg-opacity-20 backdrop-blur-md left-0 w-full h-full opacity-80"></div>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent backdrop-blur-sm">
        <div className={`parent ${theme}`}>
          <div className="card">
            <div className="logo">
              <span className="circle circle1"></span>
              <span className="circle circle2"></span>
              <span className="circle circle3"></span>
              <span className="circle circle4"></span>
              <span className="circle circle5">
                <img src={getIcon(type)} alt={type} />
              </span>
            </div>

            <div className="glass"></div>
            <div className="content">
              <span className="title">{title || type.toUpperCase()}</span>
              {amount && <span className="title">₹ {amount}</span>}
              <span className="text">{getDefaultMessage(type)}</span>
              {orderId && <span className="text">Order ID: {orderId}</span>}
              {utr && <span className="text">UTR: {utr}</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;