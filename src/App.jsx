import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense } from 'react';
import { BankTransfer, Upi, AmountPage, CardPay, Chaticon } from './components';

const Transactions = React.lazy(() => import('./screens/transactions/Transactions.jsx'));

function App() {
  return (
    <>
      <Router>  {/* Wrap your app with BrowserRouter */}
        <div className='app'>
          <Suspense fallback={<div>Loading Transaction...</div>}>
            <ErrorBoundary>
              <Routes>
                <Route
                  path='/transaction'
                  element={<AmountPage />}
                />
                <Route path="/upi" element={<Upi />} />
                <Route path="/banktranfer" element={<BankTransfer />} />
                <Route path='/cardpay' element={<CardPay />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </div>
      </Router>
      <Chaticon />
    </>
  );
}

export default App;
