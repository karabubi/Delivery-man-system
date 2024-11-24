// // import { Routes, Route } from 'react-router-dom';
// // import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignOutButton } from '@clerk/clerk-react';
// // import NavBar from './components/NavBar';
// // import Register from './components/Register';
// // import Login from './components/Login';
// // import DeliveryManagement from './components/DeliveryManagement';
// // import MapView from './components/MapView';
// // const App = () => {
// //   const clerkFrontendApi = 'pk_test_ZXRoaWNhbC10ZWFsLTI1LmNsZXJrLmFjY291bnRzLmRldiQ'; // Replace with your Clerk frontend API key

// //   return (
// //     <ClerkProvider frontendApi={clerkFrontendApi}>
// //       <NavBar />

// //       {/* Routes wrapped in ClerkProvider */}
// //       <Routes>
// //         {/* Public routes */}
// //         <Route path="/register" element={<Register />} />
// //         <Route path="/login" element={<Login />} />

// //         {/* Protected route for authenticated users */}
// //         <Route
// //           path="/delivery"
// //           element={
// //             <SignedIn>
// //               <DeliveryManagement />
// //             </SignedIn>
// //           }
// //         />

// // {/* Protected route for authenticated users to view the map */}
// // <Route path="/map" element={ <SignedIn> <MapView /> </SignedIn> } />
// //         {/* Redirect to sign-in if the user is not signed in */}
// //         <Route
// //           path="/*"
// //           element={
// //             <SignedOut>
// //               <RedirectToSignIn />
// //             </SignedOut>
// //           }
// //         />
// //       </Routes>

// //       {/* Sign-out button (can be placed in NavBar or globally accessible) */}
// //       <SignOutButton />
// //     </ClerkProvider>
// //   );
// // };

// // export default App;

// //import { Routes, Route } from "react-router-dom";
//------24-11-24


import { ClerkProvider } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./pages/NavBar";

let publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <ClerkProvider publishableKey={publishableKey}>
  {/* Navbar is placed at the top of the page */}
  <NavBar />
  {/* Render child routes */}
      <Outlet />
      
    </ClerkProvider>
  );
};

export default App;


//-----24-11



// import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, SignOutButton } from "@clerk/clerk-react";
// import { Routes, Route } from "react-router-dom";
// import NavBar from "./pages/NavBar"; // Assuming NavBar is in 'pages' directory
// import Home from "./pages/Home"; // Home page
// import Register from "./components/Register"; // Registration page
// import Login from "./components/Login"; // Login page
// import DeliveryManagement from "./components/DeliveryManagement"; // Delivery Management page
// import MapDisplay from "./components/MapDisplay.jsx"; // Map View page

// let publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// const App = () => {
//   return (
//     <ClerkProvider publishableKey={publishableKey}>
//       <NavBar />

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />

//         {/* Protected Routes */}
//         <Route
//           path="/delivery"
//           element={
//             <SignedIn>
//               <DeliveryManagement />
//             </SignedIn>
//           }
//         />

//         <Route
//           path="/map"
//           element={
//             <SignedIn>
//               <MapDisplay/>
//             </SignedIn>
//           }
//         />

//         {/* Redirects if the user is not signed in */}
//         <Route
//           path="/*"
//           element={
//             <SignedOut>
//               <RedirectToSignIn />
//             </SignedOut>
//           }
//         />
//       </Routes>

//       {/* Sign out button */}
//       <SignOutButton />
//     </ClerkProvider>
//   );
// };

// export default App;
