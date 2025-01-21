import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense, useEffect, useState } from 'react';
import { BankTransfer, Upi, CardPay, Chaticon } from './components';
import { useRef } from 'react';

const AmountPage = React.lazy(() => import('./components/AmountPage/AmountPage'));

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
          <Routes>
            <Route
              path='/transaction'
              element={
                <ErrorBoundary>
                  <Suspense fallback={<div className=''>Loading...</div>}>
                    <AmountPage isChatOpen={isChatOpen} popupRef={popupRef} closeChat={closeChat} />
                  </Suspense>
                </ErrorBoundary>
              }
            />
            <Route path="/upi" element={<Upi closeChat={closeChat} />} />
            <Route path="/banktranfer" element={<BankTransfer closeChat={closeChat} />} />
            <Route path='/cardpay' element={<CardPay closeChat={closeChat} />} />
          </Routes>
        </div>
      </Router >
      <Chaticon isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
    </>
  );
}

export default App;
