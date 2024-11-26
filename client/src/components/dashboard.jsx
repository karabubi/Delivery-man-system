// import MapDisplay from './MapDisplay.jsx';
// import TimeEstimates from './TimeEstimates.jsx';

// const RouteDashboard = () => {
//   return (
//     <div className="dashboard">
//       <h2>Route Dashboard</h2>
//       <MapDisplay />
//       <TimeEstimates />
//     </div>
//   );
// };

// export default RouteDashboard;

import ErrorBoundary from './ErrorBoundary';
import MapDisplay from './MapDisplay';
import TimeEstimates from'./TimeEstimates';
const RouteDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Route Dashboard</h2>
      <ErrorBoundary>
        <MapDisplay />
      </ErrorBoundary>
      <TimeEstimates />
    </div>
  );
};

export default RouteDashboard;
