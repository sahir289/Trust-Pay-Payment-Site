import { useEffect } from "react";
import "./modal.css"
import success from "../../assets/icons8-success-64.png"
const Modal = ({ isOpen, amount , theme }) => {
    if (!isOpen) return null; 
    // useEffect(() => {
    //     if (isOpen) {
    //         const timer = setTimeout(() => {
    //             window.location.href = "http://localhost:5173/transaction";
    //         }, 4000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [isOpen]);
    const appliedTheme = theme || "green-theme";
    return (
        <>
         <div
            className="fixed top-0  bg-white bg-opacity-20 backdrop-blur-md left-0 w-full h-full bg-black opacity-80"
            ></div>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-transparent backdrop-blur-sm">
    <div className={`parent ${appliedTheme}`}>
      <div className="card">
        <div className="logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <span className="circle circle4"></span>
          <span className="circle circle5">
     <img src={success}/>
          </span>
        </div>

        <div className="glass"></div>
        <div className="content">
          <span className="title">SUCCESS</span>
          <span className="title">₹ {amount}</span>
          <span className="text">UTR Submitted !!!</span>
             <span className="text">Your points will be credited soon</span>
        </div>

       
     
    </div>
    </div>
</div>


        </>
    );
};

export default Modal;
