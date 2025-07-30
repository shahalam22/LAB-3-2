import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaUsers, FaShieldAlt, FaClock, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  
  &.primary {
    background-color: white;
    color: #667eea;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background-color: white;
      color: #667eea;
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background-color: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e293b;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: #f8fafc;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-top: 2rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #059669;
    transform: translateY(-2px);
  }
`;

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroTitle>Connect & Travel Together</HeroTitle>
          <HeroSubtitle>
            Join our community of drivers and passengers. Share rides, save money, and make new connections.
          </HeroSubtitle>
          <HeroButtons>
            {!isAuthenticated ? (
              <>
                <HeroButton to="/register" className="primary">
                  Get Started
                </HeroButton>
                <HeroButton to="/login" className="secondary">
                  Sign In
                </HeroButton>
              </>
            ) : (
              <HeroButton to="/dashboard" className="primary">
                Go to Dashboard
              </HeroButton>
            )}
          </HeroButtons>
        </div>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>Why Choose RideShare?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaCar />
              </FeatureIcon>
              <FeatureTitle>Easy Ride Sharing</FeatureTitle>
              <FeatureDescription>
                Connect with drivers or passengers in your area. Simple, fast, and reliable ride sharing platform.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Safe & Secure</FeatureTitle>
              <FeatureDescription>
                All users are verified and rated. Your safety is our top priority with secure payment processing.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaClock />
              </FeatureIcon>
              <FeatureTitle>24/7 Availability</FeatureTitle>
              <FeatureDescription>
                Find rides anytime, anywhere. Our platform is always available to connect you with drivers.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaMapMarkerAlt />
              </FeatureIcon>
              <FeatureTitle>Real-time Tracking</FeatureTitle>
              <FeatureDescription>
                Track your ride in real-time. Know exactly when your driver will arrive and follow your journey.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaCreditCard />
              </FeatureIcon>
              <FeatureTitle>Secure Payments</FeatureTitle>
              <FeatureDescription>
                Cashless payments with secure processing. No need to carry cash for your rides.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureTitle>Community Driven</FeatureTitle>
              <FeatureDescription>
                Join a community of like-minded people. Share rides, save money, and reduce your carbon footprint.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <StatsSection>
        <div className="container">
          <SectionTitle style={{ color: 'white' }}>Our Impact</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>10K+</StatNumber>
              <StatLabel>Happy Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Rides Shared</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>95%</StatNumber>
              <StatLabel>Satisfaction Rate</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Support Available</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <CTAButton to={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Join Our Community"}
            </CTAButton>
          </div>
        </div>
      </StatsSection>
    </>
  );
};

export default Home; 