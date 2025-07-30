import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaUser, FaPhone, FaCheck, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const BrowseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BrowseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BrowseTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.875rem;
`;

const RefreshButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const RidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const RideCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-left: 4px solid #3b82f6;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RideTitle = styled.h3`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const PassengerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const RideDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const RideDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
`;

const FareDisplay = styled.div`
  background-color: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const FareAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0ea5e9;
`;

const FareLabel = styled.div`
  font-size: 0.75rem;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
    
    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background-color: #f3f4f6;
    color: #374151;
    
    &:hover {
      background-color: #e5e7eb;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const RideBrowse = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingRides, setApplyingRides] = useState(new Set());
  const [filter, setFilter] = useState('posted');

  useEffect(() => {
    fetchRides();
  }, [filter]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rides?status=${filter}`);
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to load rides');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToRide = async (rideId) => {
    try {
      setApplyingRides(prev => new Set(prev).add(rideId));
      
      await axios.post(`/api/rides/${rideId}/apply`);
      
      toast.success('Application submitted successfully!');
      
      // Remove the ride from the list since it's no longer available
      setRides(prev => prev.filter(ride => ride.rideRequestId !== rideId));
      
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to apply to ride';
      toast.error(message);
    } finally {
      setApplyingRides(prev => {
        const newSet = new Set(prev);
        newSet.delete(rideId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeUntil = (dateString) => {
    const targetTime = new Date(dateString);
    const now = new Date();
    const diffMs = targetTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m from now`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m from now`;
    } else {
      return 'Now';
    }
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </LoadingSpinner>
    );
  }

  return (
    <BrowseContainer>
      <BrowseHeader>
        <BrowseTitle>Available Rides</BrowseTitle>
        <FilterSection>
          <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="posted">Posted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </FilterSelect>
          <RefreshButton onClick={fetchRides}>
            Refresh
          </RefreshButton>
        </FilterSection>
      </BrowseHeader>

      {rides.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FaMapMarkerAlt />
          </EmptyStateIcon>
          <h3>No rides available</h3>
          <p>
            {filter === 'posted' 
              ? "No ride requests are currently posted. Check back later!"
              : `No rides with status "${filter}" found.`
            }
          </p>
        </EmptyState>
      ) : (
        <RidesGrid>
          {rides.map((ride) => (
            <RideCard key={ride.rideRequestId}>
              <RideHeader>
                <div>
                  <RideTitle>
                    {ride.pickupLocation} → {ride.dropoffLocation}
                  </RideTitle>
                  <PassengerInfo>
                    <FaUser />
                    <span>{ride.passengerName}</span>
                  </PassengerInfo>
                </div>
              </RideHeader>
              
              <RideDetails>
                <RideDetail>
                  <FaMapMarkerAlt />
                  <span><strong>From:</strong> {ride.pickupLocation}</span>
                </RideDetail>
                <RideDetail>
                  <FaMapMarkerAlt />
                  <span><strong>To:</strong> {ride.dropoffLocation}</span>
                </RideDetail>
                <RideDetail>
                  <FaClock />
                  <span><strong>When:</strong> {formatDate(ride.targetTime)}</span>
                </RideDetail>
                <RideDetail>
                  <FaClock />
                  <span style={{ color: '#059669' }}>
                    {formatTimeUntil(ride.targetTime)}
                  </span>
                </RideDetail>
              </RideDetails>
              
              <FareDisplay>
                <FareAmount>${ride.desiredFare}</FareAmount>
                <FareLabel>Desired Fare</FareLabel>
              </FareDisplay>
              
              <ActionButtons>
                <ActionButton
                  className="primary"
                  onClick={() => handleApplyToRide(ride.rideRequestId)}
                  disabled={applyingRides.has(ride.rideRequestId)}
                >
                  {applyingRides.has(ride.rideRequestId) ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Apply
                    </>
                  )}
                </ActionButton>
                <ActionButton className="secondary">
                  <FaPhone />
                  Contact
                </ActionButton>
              </ActionButtons>
            </RideCard>
          ))}
        </RidesGrid>
      )}
    </BrowseContainer>
  );
};

export default RideBrowse; 