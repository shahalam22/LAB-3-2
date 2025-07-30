import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaCar, FaMapMarkerAlt, FaClock, FaDollarSign, FaUser, FaPhone } from 'react-icons/fa';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const RideCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #3b82f6;
`;

const RideHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RideTitle = styled.h3`
  font-weight: 600;
  color: #1e293b;
`;

const RideStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  &.posted {
    background-color: #dbeafe;
    color: #1d4ed8;
  }
  
  &.in-progress {
    background-color: #fef3c7;
    color: #d97706;
  }
  
  &.completed {
    background-color: #d1fae5;
    color: #059669;
  }
`;

const RideDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RideDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  
  &.primary {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  }
  
  &.secondary {
    background-color: #f3f4f6;
    color: #374151;
    
    &:hover {
      background-color: #e5e7eb;
    }
  }
  
  &.success {
    background-color: #10b981;
    color: white;
    
    &:hover {
      background-color: #059669;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickActionCard = styled(Link)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const QuickActionTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
`;

const QuickActionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Dashboard = () => {
  const { user, isDriver, isPassenger } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    pendingRides: 0,
    earnings: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's rides
      const ridesResponse = await axios.get('/api/rides/my-rides');
      const rides = ridesResponse.data;
      
      // Calculate stats
      const totalRides = rides.length;
      const completedRides = rides.filter(ride => ride.status === 'completed').length;
      const pendingRides = rides.filter(ride => ride.status === 'posted' || ride.status === 'in-progress').length;
      const earnings = rides
        .filter(ride => ride.status === 'completed')
        .reduce((sum, ride) => sum + (ride.fare || 0), 0);
      
      setStats({
        totalRides,
        completedRides,
        pendingRides,
        earnings
      });
      
      // Get recent rides (last 5)
      setRecentRides(rides.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'posted': return 'posted';
      case 'in-progress': return 'in-progress';
      case 'completed': return 'completed';
      default: return 'posted';
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

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user?.name}!</WelcomeTitle>
        <WelcomeSubtitle>
          {isDriver ? 'Ready to help passengers get to their destination?' : 'Need a ride? Find drivers in your area.'}
        </WelcomeSubtitle>
      </WelcomeSection>

      <QuickActions>
        {isPassenger && (
          <QuickActionCard to="/ride-request">
            <QuickActionTitle>Request a Ride</QuickActionTitle>
            <QuickActionDescription>
              Post a new ride request and find drivers
            </QuickActionDescription>
          </QuickActionCard>
        )}
        
        {isDriver && (
          <QuickActionCard to="/ride-browse">
            <QuickActionTitle>Browse Rides</QuickActionTitle>
            <QuickActionDescription>
              Find available ride requests from passengers
            </QuickActionDescription>
          </QuickActionCard>
        )}
        
        <QuickActionCard to="/profile">
          <QuickActionTitle>Update Profile</QuickActionTitle>
          <QuickActionDescription>
            Manage your account information
          </QuickActionDescription>
        </QuickActionCard>
      </QuickActions>

      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.totalRides}</StatNumber>
          <StatLabel>Total Rides</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.completedRides}</StatNumber>
          <StatLabel>Completed Rides</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pendingRides}</StatNumber>
          <StatLabel>Pending Rides</StatLabel>
        </StatCard>
        {isDriver && (
          <StatCard>
            <StatNumber>${stats.earnings.toFixed(2)}</StatNumber>
            <StatLabel>Total Earnings</StatLabel>
          </StatCard>
        )}
      </StatsGrid>

      <div>
        <SectionTitle>Recent Rides</SectionTitle>
        
        {recentRides.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FaCar />
            </EmptyStateIcon>
            <h3>No rides yet</h3>
            <p>
              {isPassenger 
                ? "Start by requesting your first ride!"
                : "Start by browsing available ride requests!"
              }
            </p>
          </EmptyState>
        ) : (
          recentRides.map((ride) => (
            <RideCard key={ride._id}>
              <RideHeader>
                <RideTitle>
                  {ride.pickupLocation} → {ride.dropoffLocation}
                </RideTitle>
                <RideStatus className={getStatusColor(ride.status)}>
                  {ride.status.replace('-', ' ')}
                </RideStatus>
              </RideHeader>
              
              <RideDetails>
                <RideDetail>
                  <FaMapMarkerAlt />
                  <span>From: {ride.pickupLocation}</span>
                </RideDetail>
                <RideDetail>
                  <FaMapMarkerAlt />
                  <span>To: {ride.dropoffLocation}</span>
                </RideDetail>
                <RideDetail>
                  <FaClock />
                  <span>{formatDate(ride.targetTime)}</span>
                </RideDetail>
                <RideDetail>
                  <FaDollarSign />
                  <span>${ride.desiredFare || ride.fare}</span>
                </RideDetail>
              </RideDetails>
              
              <ActionButtons>
                {ride.status === 'posted' && isDriver && (
                  <ActionButton 
                    className="primary"
                    onClick={() => handleApplyToRide(ride._id)}
                  >
                    Apply
                  </ActionButton>
                )}
                
                {ride.status === 'posted' && isPassenger && (
                  <ActionButton 
                    className="primary"
                    onClick={() => handleViewApplications(ride._id)}
                  >
                    View Applications
                  </ActionButton>
                )}
                
                <ActionButton className="secondary">
                  View Details
                </ActionButton>
              </ActionButtons>
            </RideCard>
          ))
        )}
      </div>
    </DashboardContainer>
  );
};

export default Dashboard; 