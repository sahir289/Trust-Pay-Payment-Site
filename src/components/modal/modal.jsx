/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect } from "react"; // Import useEffect
import "./modal.css";
import success from "../../assets/success.png";

const Modal = ({ isOpen, amount, orderId, utr, redirectUrl, theme }) => {
  // If modal is not open, return null
  if (!isOpen) return null;

  // Set up redirect after 5 seconds
  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  const appliedTheme = theme || "green-theme";

  return (
    <>
      <div className="fixed top-0 bg-white bg-opacity-20 backdrop-blur-md left-0 w-full h-full opacity-80"></div>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent backdrop-blur-sm">
        <div className={`parent ${appliedTheme}`}>
          <div className="card">
            <div className="logo">
              <span className="circle circle1"></span>
              <span className="circle circle2"></span>
              <span className="circle circle3"></span>
              <span className="circle circle4"></span>
              <span className="circle circle5">
                <img src={success} alt="Success" />
              </span>
            </div>

            <div className="glass"></div>
            <div className="content">
              <span className="title">SUCCESS</span>
              <span className="title">₹ {amount}</span>
              <span className="text">UTR Submitted !!!</span>
              <span className="text">Your points will be credited soon</span>
              <span className="text">Order ID: {orderId ? orderId : "--"}</span>
              <span className="text">UTR: {utr ? utr : "--"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;