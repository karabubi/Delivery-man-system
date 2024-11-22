import { useEffect, useState } from 'react';
import axios from 'axios';

const TimeEstimates = () => {
  const [timeData, setTimeData] = useState({});

  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const response = await axios.get('/api/route/times');
        setTimeData(response.data);
      } catch (error) {
        console.error('Error fetching time data:', error);
      }
    };
    fetchTimeData();
  }, []);

  return (
    <div className="time-estimates">
      <h3>Total Travel Time: {timeData.totalTime || 'Loading...'}</h3>
      <ul>
        {timeData.nodeTimes &&
          timeData.nodeTimes.map((time, index) => (
            <li key={index}>Node {index + 1} to Node {index + 2}: {time} minutes</li>
          ))}
      </ul>
    </div>
  );
};

export default TimeEstimates;
