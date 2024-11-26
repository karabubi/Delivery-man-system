import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

//const frontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;
const frontendApi = 'pk_test_ZXRoaWNhbC10ZWFsLTI1LmNsZXJrLmFjY291bnRzLmRldiQ';

const container = document.getElementById('root'); // Get the root DOM node
const root = createRoot(container!); // Create a root

root.render(
  <React.StrictMode>
    <ClerkProvider frontendApi={frontendApi}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
