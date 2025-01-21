import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense, useEffect, useState } from 'react';
import { BankTransfer, Upi, AmountPage, CardPay, Chaticon } from './components';
import { useRef } from 'react';

const Transactions = React.lazy(() => import('./screens/transactions/Transactions.jsx'));

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const popupRef = useRef(null);


  const closeChat = () => {
    setIsChatOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeChat();
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);


  return (
    <>
      <Router> 
        <div className='app'>
          <Suspense fallback={<div>Loading Transaction...</div>}>
            <ErrorBoundary>
              <Routes>
                <Route
                  path='/transaction'
                  element={<AmountPage isChatOpen={isChatOpen} popupRef={popupRef} closeChat={closeChat}/>}
                />
                <Route path="/upi" element={<Upi closeChat={closeChat}/>} />
                <Route path="/banktranfer" element={<BankTransfer  closeChat={closeChat}/>} />
                <Route path='/cardpay' element={<CardPay  closeChat={closeChat}/>} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </div>
      </Router>
      <Chaticon isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}/>
    </>
  );
}

export default App;
