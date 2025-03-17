import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense, useState } from 'react';
import { BankTransfer, Upi, CardPay, Chaticon } from './components';
import { useRef } from 'react';
const AmountPage = React.lazy(() => import('./components/AmountPage/AmountPage'));

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const popupRef = useRef(null);
  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div >
      <div className='h-screen' onClick={closeChat}>
        <Router>
          <div className='app'>
            <Routes>
              <Route
                path='/transaction/:token'
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
      </div>
      {/* <Chaticon openChat={openChat} close={closeChat} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} /> */}
    </div>
  );
}

export default App;
