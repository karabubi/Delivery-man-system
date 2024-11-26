import { render, screen, waitFor } from '@testing-library/react';
import MapDisplay from './MapDisplay'; // Path to your MapDisplay component
import viet from 'viet'; // Import viet
import { MapContainer } from 'react-leaflet'; // To ensure the map is rendered correctly
import {describe} from '@testing-library/jest-dom'
import { expect} from '@testing-library/jest-dom'
describe('MapDisplay Component', () => {
  it('renders the map and markers correctly after fetching data', async () => {
    // Actual API call (Note: This will make a real HTTP request)
    const mockResponse = {
      data: {
        locations: [
          { name: 'Location 1', coords: [50.73743, 7.098206] },
          { name: 'Location 2', coords: [50.73843, 7.099206] },
        ],
        route: [
          { coords: [50.73743, 7.098206] },
          { coords: [50.73843, 7.099206] },
        ],
      },
    };

    // Use viet to simulate a request (actual HTTP call will be made)
    // This will be handled directly by the MapDisplay component
    viet.get = jest.fn().mockResolvedValue(mockResponse); // Mock viet.get directly here

    // Render the MapDisplay component
    render(<MapDisplay />);

    // Check that the loading text is shown initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the data to be fetched and check the map content
    await waitFor(() => screen.getByText('Location 1')); // Check that Location 1 is in the document
    expect(screen.getByText('Location 2')).toBeInTheDocument(); // Check that Location 2 is rendered

    // Check that the MapContainer is present (this confirms the map is rendered)
    expect(screen.getByTestId('map')).toBeInTheDocument();

    // Check for the presence of marker popups (This simulates that the popup will be rendered)
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();
  });

  it('displays an error message if the API call fails', async () => {
    // Simulate API failure (this will trigger an error in your component)
    viet.get = jest.fn().mockRejectedValue(new Error('Error fetching route data'));

    render(<MapDisplay />);

    // Check for the error message
    await waitFor(() => screen.getByText('Error fetching route data'));
    expect(screen.getByText('Error fetching route data')).toBeInTheDocument();
  });
});
