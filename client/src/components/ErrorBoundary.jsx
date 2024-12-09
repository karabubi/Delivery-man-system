// import { Component } from 'react';

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, errorMessage: '' };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, errorMessage: error.message };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong: {this.state.errorMessage}</h1>;
//     }

//     return this.props.children; 
//   }
// }

// export default ErrorBoundary;


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
