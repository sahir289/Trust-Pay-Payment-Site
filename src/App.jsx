import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './App.css';
import ErrorBoundary from './components/errorBoundary';
import React, { Suspense } from 'react';

const Transactions = React.lazy(() => import('./screens/transactions/Transactions.jsx'));

function App() {
  return (
    <Router>  {/* Wrap your app with BrowserRouter */}
      <div className='app'>
        <Suspense fallback={<div>Loading Transaction...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route 
                path='/transaction'
                element={<Transactions />}
              />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
