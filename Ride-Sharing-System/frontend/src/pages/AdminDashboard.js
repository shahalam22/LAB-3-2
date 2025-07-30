import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCar, FaDollarSign, FaChartLine, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import styled from 'styled-components';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const AdminHeader = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const AdminSubtitle = styled.p`
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
  border-left: 4px solid #3b82f6;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
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

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DataCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-weight: 600;
  color: #1e293b;
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

const UserList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const UserRole = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  
  &.passenger {
    background-color: #dbeafe;
    color: #1d4ed8;
  }
  
  &.driver {
    background-color: #d1fae5;
    color: #059669;
  }
  
  &.admin {
    background-color: #fef3c7;
    color: #d97706;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &.activate {
    background-color: #10b981;
    color: white;
    
    &:hover {
      background-color: #059669;
    }
  }
  
  &.deactivate {
    background-color: #ef4444;
    color: white;
    
    &:hover {
      background-color: #dc2626;
    }
  }
`;

const RideList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const RideItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RideInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RideRoute = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const RideStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
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
  font-size: 0.875rem;
  color: #6b7280;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRides: 0,
    totalEarnings: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin statistics
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data);
      
      // Fetch recent users
      const usersResponse = await axios.get('/api/admin/users');
      setUsers(usersResponse.data);
      
      // Fetch recent rides
      const ridesResponse = await axios.get('/api/admin/rides');
      setRides(ridesResponse.data);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'activate') {
        await axios.put(`/api/admin/users/${userId}/activate`);
        toast.success('User activated successfully');
      } else if (action === 'deactivate') {
        await axios.put(`/api/admin/users/${userId}/deactivate`);
        toast.success('User deactivated successfully');
      }
      
      // Refresh data
      fetchAdminData();
      
    } catch (error) {
      const message = error.response?.data?.error || 'Action failed';
      toast.error(message);
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
    return (
      <LoadingSpinner>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </LoadingSpinner>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Admin Dashboard</AdminTitle>
        <AdminSubtitle>Monitor and manage the ride-sharing system</AdminSubtitle>
      </AdminHeader>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaUsers />
          </StatIcon>
          <StatNumber>{stats.totalUsers}</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaCar />
          </StatIcon>
          <StatNumber>{stats.totalRides}</StatNumber>
          <StatLabel>Total Rides</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaDollarSign />
          </StatIcon>
          <StatNumber>${stats.totalEarnings?.toFixed(2) || '0.00'}</StatNumber>
          <StatLabel>Total Earnings</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaChartLine />
          </StatIcon>
          <StatNumber>{stats.activeUsers}</StatNumber>
          <StatLabel>Active Users</StatLabel>
        </StatCard>
      </StatsGrid>

      <DataGrid>
        <DataCard>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <RefreshButton onClick={fetchAdminData}>
              Refresh
            </RefreshButton>
          </CardHeader>
          
          <UserList>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                No users found
              </div>
            ) : (
              users.map((user) => (
                <UserItem key={user._id}>
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <UserRole className={user.role}>
                      {user.role}
                    </UserRole>
                    
                    <UserActions>
                      {user.isActive ? (
                        <ActionButton
                          className="deactivate"
                          onClick={() => handleUserAction(user._id, 'deactivate')}
                        >
                          <FaUserTimes />
                          Deactivate
                        </ActionButton>
                      ) : (
                        <ActionButton
                          className="activate"
                          onClick={() => handleUserAction(user._id, 'activate')}
                        >
                          <FaUserCheck />
                          Activate
                        </ActionButton>
                      )}
                    </UserActions>
                  </div>
                </UserItem>
              ))
            )}
          </UserList>
        </DataCard>

        <DataCard>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
            <RefreshButton onClick={fetchAdminData}>
              Refresh
            </RefreshButton>
          </CardHeader>
          
          <RideList>
            {rides.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                No rides found
              </div>
            ) : (
              rides.map((ride) => (
                <RideItem key={ride._id}>
                  <RideInfo>
                    <RideRoute>
                      {ride.pickupLocation} → {ride.dropoffLocation}
                    </RideRoute>
                    <RideStatus className={ride.status}>
                      {ride.status.replace('-', ' ')}
                    </RideStatus>
                  </RideInfo>
                  
                  <RideDetails>
                    <div>Passenger: {ride.passengerName}</div>
                    <div>Fare: ${ride.desiredFare || ride.fare}</div>
                    <div>Date: {formatDate(ride.targetTime)}</div>
                  </RideDetails>
                </RideItem>
              ))
            )}
          </RideList>
        </DataCard>
      </DataGrid>
    </AdminContainer>
  );
};

export default AdminDashboard; 