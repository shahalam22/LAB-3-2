import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaPaperPlane } from 'react-icons/fa';
import styled from 'styled-components';

const RequestContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
`;

const RequestCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const RequestTitle = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const InputContainer = styled.div`
  position: relative;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  color: #9ca3af;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoBox = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #0369a1;
`;

const RideRequest = () => {
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    targetTime: '',
    desiredFare: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    
    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = 'Dropoff location is required';
    }
    
    if (!formData.targetTime) {
      newErrors.targetTime = 'Target time is required';
    } else {
      const selectedTime = new Date(formData.targetTime);
      const now = new Date();
      if (selectedTime <= now) {
        newErrors.targetTime = 'Target time must be in the future';
      }
    }
    
    if (!formData.desiredFare) {
      newErrors.desiredFare = 'Desired fare is required';
    } else if (isNaN(formData.desiredFare) || parseFloat(formData.desiredFare) <= 0) {
      newErrors.desiredFare = 'Desired fare must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const requestData = {
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        targetTime: new Date(formData.targetTime).toISOString(),
        desiredFare: parseFloat(formData.desiredFare),
        notes: formData.notes.trim()
      };
      
      await axios.post('/api/rides', requestData);
      
      toast.success('Ride request posted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to post ride request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Set minimum datetime to now
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 30 * 60000).toISOString().slice(0, 16); // 30 minutes from now

  return (
    <RequestContainer>
      <RequestCard>
        <RequestTitle>Request a Ride</RequestTitle>
        
        <InfoBox>
          <strong>Tips for a successful ride request:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Be specific with pickup and dropoff locations</li>
            <li>Set a reasonable fare that drivers will accept</li>
            <li>Provide any special requirements in the notes</li>
            <li>Allow at least 30 minutes for drivers to respond</li>
          </ul>
        </InfoBox>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="pickupLocation">Pickup Location</FormLabel>
            <InputContainer>
              <InputIcon>
                <FaMapMarkerAlt />
              </InputIcon>
              <FormInput
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                className={errors.pickupLocation ? 'error' : ''}
                placeholder="Enter pickup address or location"
              />
            </InputContainer>
            {errors.pickupLocation && <ErrorMessage>{errors.pickupLocation}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="dropoffLocation">Dropoff Location</FormLabel>
            <InputContainer>
              <InputIcon>
                <FaMapMarkerAlt />
              </InputIcon>
              <FormInput
                type="text"
                id="dropoffLocation"
                name="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={handleChange}
                className={errors.dropoffLocation ? 'error' : ''}
                placeholder="Enter destination address or location"
              />
            </InputContainer>
            {errors.dropoffLocation && <ErrorMessage>{errors.dropoffLocation}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="targetTime">When do you need the ride?</FormLabel>
            <InputContainer>
              <InputIcon>
                <FaClock />
              </InputIcon>
              <FormInput
                type="datetime-local"
                id="targetTime"
                name="targetTime"
                value={formData.targetTime}
                onChange={handleChange}
                min={minDateTime}
                className={errors.targetTime ? 'error' : ''}
              />
            </InputContainer>
            {errors.targetTime && <ErrorMessage>{errors.targetTime}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="desiredFare">Desired Fare ($)</FormLabel>
            <InputContainer>
              <InputIcon>
                <FaDollarSign />
              </InputIcon>
              <FormInput
                type="number"
                id="desiredFare"
                name="desiredFare"
                value={formData.desiredFare}
                onChange={handleChange}
                className={errors.desiredFare ? 'error' : ''}
                placeholder="Enter your budget for this ride"
                min="0"
                step="0.01"
              />
            </InputContainer>
            {errors.desiredFare && <ErrorMessage>{errors.desiredFare}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="notes">Additional Notes (Optional)</FormLabel>
            <InputContainer>
              <InputIcon>
                <FaMapMarkerAlt />
              </InputIcon>
              <FormTextarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements, luggage details, or additional information..."
              />
            </InputContainer>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                Posting Request...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Post Ride Request
              </>
            )}
          </SubmitButton>
        </Form>
      </RequestCard>
    </RequestContainer>
  );
};

export default RideRequest; 