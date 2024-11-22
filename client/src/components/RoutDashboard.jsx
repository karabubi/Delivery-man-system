import MapDisplay from './MapDisplay.jsx';
import TimeEstimates from './TimeEstimates.jsx';

const RouteDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Route Dashboard</h2>
      <MapDisplay />
      <TimeEstimates />
    </div>
  );
};

export default RouteDashboard;
