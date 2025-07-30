import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaCar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ProfileField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const FieldValue = styled.div`
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
`;

const FieldInput = styled.input`
  padding: 0.75rem;
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

const FieldSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #059669;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #e5e7eb;
  }
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
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

const StatsSection = styled.div`
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'passenger'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'passenger'
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.role === 'driver' && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for drivers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'passenger'
    });
    setErrors({});
    setIsEditing(false);
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

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileTitle>Profile</ProfileTitle>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>
              <FaEdit />
              Edit Profile
            </EditButton>
          )}
        </ProfileHeader>

        <ProfileSection>
          <SectionTitle>Personal Information</SectionTitle>
          <ProfileGrid>
            <ProfileField>
              <FieldLabel>Full Name</FieldLabel>
              {isEditing ? (
                <>
                  <FieldInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </>
              ) : (
                <FieldValue>{user.name}</FieldValue>
              )}
            </ProfileField>

            <ProfileField>
              <FieldLabel>Email</FieldLabel>
              {isEditing ? (
                <>
                  <FieldInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </>
              ) : (
                <FieldValue>{user.email}</FieldValue>
              )}
            </ProfileField>

            <ProfileField>
              <FieldLabel>Role</FieldLabel>
              {isEditing ? (
                <FieldSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="passenger">Passenger</option>
                  <option value="driver">Driver</option>
                </FieldSelect>
              ) : (
                <FieldValue>
                  <RoleBadge className={user.role}>
                    <FaCar />
                    {user.role}
                  </RoleBadge>
                </FieldValue>
              )}
            </ProfileField>

            <ProfileField>
              <FieldLabel>Phone Number</FieldLabel>
              {isEditing ? (
                <>
                  <FieldInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder={formData.role === 'driver' ? 'Required for drivers' : 'Optional'}
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </>
              ) : (
                <FieldValue>
                  {user.phone ? (
                    <>
                      <FaPhone style={{ marginRight: '0.5rem' }} />
                      {user.phone}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </FieldValue>
              )}
            </ProfileField>
          </ProfileGrid>
        </ProfileSection>

        <StatsSection>
          <SectionTitle>Account Statistics</SectionTitle>
          <StatsGrid>
            <StatItem>
              <StatNumber>0</StatNumber>
              <StatLabel>Total Rides</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>0</StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>0</StatNumber>
              <StatLabel>Pending</StatLabel>
            </StatItem>
            {user.role === 'driver' && (
              <StatItem>
                <StatNumber>$0.00</StatNumber>
                <StatLabel>Earnings</StatLabel>
              </StatItem>
            )}
          </StatsGrid>
        </StatsSection>

        {isEditing && (
          <ActionButtons>
            <CancelButton onClick={handleCancel}>
              <FaTimes />
              Cancel
            </CancelButton>
            <SaveButton onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </SaveButton>
          </ActionButtons>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile; 