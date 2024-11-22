import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AddressList from "./components/AddressList";
import RoutDashboard from "./components/RoutDashboard.jsx";
import DeliveryManagement from "./components/DeliveryManagement.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "addresses",
        element: <AddressList />,
      },
      {
        path: "RoutDashboard",
        element: <RoutDashboard />,
      },
      {
        path: "delivery",
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
