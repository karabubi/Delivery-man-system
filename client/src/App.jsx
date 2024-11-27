import { ClerkProvider } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";
import Home from "./pages/Home"; //<--- May be deleted here from imports. You do not use it.
import NavBar from "./components/NavBar";

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
