
import ErrorBoundary from "./ErrorBoundary.jsx";
import MapDisplay from "./MapDisplay.jsx";

const RouteDashboard = () => {
  return (
    <div className="Dashboard">
      <div className="Dashboard-box">
        <h2>Route Dashboard</h2>
        <ErrorBoundary>
          <MapDisplay />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default RouteDashboard;
