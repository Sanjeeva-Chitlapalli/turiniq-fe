import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setBusinessData } from '../store/businessSlice';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactEmail: '',
  });
  const [errors, setErrors] = useState({});

  const businessTypes = ['Tech', 'Retail', 'Finance', 'Healthcare', 'Education', 'Other'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Please select a Business Type';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Dispatch the signup data to Redux store
    dispatch(setBusinessData(formData));

    // Check localStorage for agentType, business, and goal
    try {
      const serializedState = localStorage.getItem('businessState');
      const businessState = serializedState ? JSON.parse(serializedState) : {};
      const hasSettingsData = businessState.agentType && businessState.business && businessState.goal;

      // Redirect based on presence of settings data
      if (hasSettingsData) {
        navigate('/business/configurator');
      } else {
        navigate('/settings');
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      // Default to settings page if there's an error
      navigate('/settings');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-[#292928] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up Your Business</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-white mb-1">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#191919] text-white rounded-full focus:outline-none"
              placeholder="Enter your business name"
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
            )}
          </div>

          {/* Business Type */}
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-white mb-1">
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#191919] text-white rounded-full focus:outline-none"
            >
              <option value="">Select a business type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-500">{errors.businessType}</p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-1">
              Primary Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#191919] text-white rounded-full focus:outline-none "
              placeholder="Enter your email"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#191919] text-white rounded-full hover:bg-black transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;