import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCar, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  
  &:hover {
    color: #2563eb;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #374151;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #f3f4f6;
    color: #3b82f6;
  }
  
  &.active {
    background-color: #3b82f6;
    color: white;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &.login {
    color: #3b82f6;
    border: 2px solid #3b82f6;
    
    &:hover {
      background-color: #3b82f6;
      color: white;
    }
  }
  
  &.register {
    background-color: #3b82f6;
    color: white;
    
    &:hover {
      background-color: #2563eb;
    }
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout, isDriver, isPassenger, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <FaCar />
          RideShare
        </Logo>

        <NavMenu>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </NavLink>
          
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
                Dashboard
              </NavLink>
              
              {isPassenger && (
                <NavLink to="/ride-request" className={isActive('/ride-request') ? 'active' : ''}>
                  Request Ride
                </NavLink>
              )}
              
              {isDriver && (
                <NavLink to="/ride-browse" className={isActive('/ride-browse') ? 'active' : ''}>
                  Browse Rides
                </NavLink>
              )}
              
              {isAdmin && (
                <NavLink to="/admin" className={isActive('/admin') ? 'active' : ''}>
                  Admin
                </NavLink>
              )}
            </>
          )}
        </NavMenu>

        <UserMenu>
          {isAuthenticated ? (
            <>
              <UserInfo>
                <FaUser />
                {user?.name}
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" className="login">
                Login
              </AuthButton>
              <AuthButton to="/register" className="register">
                Register
              </AuthButton>
            </AuthButtons>
          )}
        </UserMenu>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      <MobileMenu isOpen={mobileMenuOpen}>
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
          Home
        </NavLink>
        
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </NavLink>
            
            {isPassenger && (
              <NavLink to="/ride-request" onClick={() => setMobileMenuOpen(false)}>
                Request Ride
              </NavLink>
            )}
            
            {isDriver && (
              <NavLink to="/ride-browse" onClick={() => setMobileMenuOpen(false)}>
                Browse Rides
              </NavLink>
            )}
            
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </NavLink>
            )}
            
            <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </NavLink>
            
            <LogoutButton onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </>
        )}
      </MobileMenu>
    </Nav>
  );
};

export default Navbar; 