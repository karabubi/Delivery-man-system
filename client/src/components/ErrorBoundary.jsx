
import { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle errors
  const handleError = (error, errorInfo) => {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    setHasError(true);
    setErrorMessage(error.message);
  };

  // Hook to capture errors during component mounting
  useEffect(() => {
    const errorHandler = (error) => {
      handleError(error);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return <h1>Something went wrong: {errorMessage}</h1>;
  }

  return children;
};

export default ErrorBoundary;
