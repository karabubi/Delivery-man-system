import React from 'react';
import ReactDOM from 'react-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

//const publishableKey = process.env.REACT_APP_CLERK_FRONTEND_API;
const publishableKey ='pk_test_ZXRoaWNhbC10ZWFsLTI1LmNsZXJrLmFjY291bnRzLmRldiQ';
ReactDOM.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
