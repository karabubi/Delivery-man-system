import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import axios from 'axios';

const AuthForm = ({ endpoint, formFields = [], onSuccess }) => {
  // Initialize formData with default empty values
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => {
      acc[field.name] = ""; // Default to empty string
      return acc;
    }, {})
  );

  const [error, setError] = useState(null);

  // Update formData when inputs change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to the specified endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(endpoint, formData); // Send form data
      if (onSuccess) onSuccess(response.data); // Call onSuccess with API response
    } catch (err) {
      console.error(err); // Log error for debugging
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map(({ name, type = "text", placeholder }) => (
        <div key={name}>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]} // Controlled component
            onChange={handleChange}
            required
            aria-label={placeholder || name} // Improve accessibility
          />
        </div>
      ))}
      <button type="submit">Submit</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error display */}
    </form>
  );
};

// Add PropTypes for validation
AuthForm.propTypes = {
  endpoint: PropTypes.string.isRequired, // 'endpoint' must be a string and is required
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired, // Each field must have a 'name' (string)
      type: PropTypes.string, // Optional: 'type' of the input
      placeholder: PropTypes.string, // Optional: 'placeholder' text
    })
  ).isRequired,
  onSuccess: PropTypes.func.isRequired, // 'onSuccess' must be a function and is required
};

export default AuthForm;
