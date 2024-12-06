import ErrorBoundary from "./ErrorBoundary.jsx";
import MapDisplay from "./MapDisplay.jsx";
import TimeEstimates from "./TimeEstimates.jsx";
import "./Dashboard.css"; 

const RouteDashboard = () => {
  return (
    <div className="Dashboard">
      <div className="Dashboard-box">
        <h2>Route Dashboard</h2>
        <ErrorBoundary>
          <MapDisplay />
        </ErrorBoundary>
        <TimeEstimates />
      </div>
    </div>
  );
};

export default RouteDashboard;

