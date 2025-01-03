import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddressList from "./components/AddressList";
import RouteDashboard from "./components/Dashboard.jsx";
import DeliveryManagement from "./components/DeliveryManagement.jsx";
import Home from "./pages/Home.jsx";
import BigMapView from "./components/BigMapView.jsx";
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
        path: "addresses",
        element: <AddressList />,
      },
      {
        path: "Dashboard",
        element: <RouteDashboard />,
      },
      {
        path: "manage",
        element: <DeliveryManagement />,
      },

      {
        path: "bigmap",
        element: <BigMapView />,
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
