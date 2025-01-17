import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense } from 'react';
import { BankTransfer, Upi } from './components/index.js';
import AmountPage from './components/AmountPage/AmountPage.jsx';
import ChatIcon from './components/Chaticon/Chaticon.jsx';

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
              <Route path="/upi" element={<Upi/>} />
              <Route path="/banktranfer" element={<BankTransfer/>} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>
    </Router>
     <ChatIcon/>
                </>
  );
}

export default App;
