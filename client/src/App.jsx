
import { Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignOutButton } from '@clerk/clerk-react';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Login from './components/Login';
import DeliveryManagement from './components/DeliveryManagement';
import MapView from './components/MapView';
const App = () => {
  const clerkFrontendApi = 'pk_test_ZXRoaWNhbC10ZWFsLTI1LmNsZXJrLmFjY291bnRzLmRldiQ'; // Replace with your Clerk frontend API key

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <NavBar />
      
      {/* Routes wrapped in ClerkProvider */}
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route for authenticated users */}
        <Route
          path="/delivery"
          element={
            <SignedIn>
              <DeliveryManagement />
            </SignedIn>
          }
        />

{/* Protected route for authenticated users to view the map */} 
<Route path="/map" element={ <SignedIn> <MapView /> </SignedIn> } />
        {/* Redirect to sign-in if the user is not signed in */}
        <Route
          path="/*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>

      {/* Sign-out button (can be placed in NavBar or globally accessible) */}
      <SignOutButton />
    </ClerkProvider>
  );
};

export default App;



