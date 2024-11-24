import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AddressList from "./components/AddressList";
import RoutDashboard from "./components/RoutDashboard.jsx";
import DeliveryManagement from "./components/DeliveryManagement.jsx";
import Home from "./pages/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
      path:"login",
      element:<Login/>
    },
      {
        path: "addresses",
        element: <AddressList />,
      },
      {
        path: "dashboard",
        element: <RoutDashboard />,
      },
      {
        path: "manage",
        element: <DeliveryManagement />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
