
import './Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header-home">
        <div className="header-content">
          <h1>Welcome to the Delivery System</h1>
        </div>
      </header>
      {/* Main content description */}
      <div className="home-main">
        <h2>How to Use the Delivery System</h2>
        <p>
          The Delivery System helps you organize your deliveries and optimize your routes, saving time and cost. Here's how you can use it:
        </p>
        <ul>
          <li><strong>Route Dashboard:</strong> View and manage your delivery routes. You can track your delivery progress and optimize paths.</li>
          <li><strong>Addresses:</strong> Add, update, or delete delivery addresses. Keep your delivery locations organized.</li>
          <li><strong>Delivery Management:</strong> Manage the status of your deliveries and make adjustments as needed.</li>
          <li><strong>Big Map View:</strong> See all your locations and delivery routes on an interactive map for better visual tracking.</li>
        </ul>
        <p>
          Start by exploring the Dashboard to get an overview of your routes or manage your delivery addresses directly.
        </p>
      </div>
    </div>
  );
};

export default Home;
