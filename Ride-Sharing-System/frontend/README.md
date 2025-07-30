# RideShare Frontend

A modern React.js frontend for the RideShare ride-sharing system. This application provides a beautiful and intuitive interface for passengers and drivers to connect and share rides.

## Features

### 🚗 **For Passengers**
- Request rides with pickup and dropoff locations
- Set desired fare and timing
- View driver applications and select drivers
- Track ride status and history
- Secure payment processing

### 🚘 **For Drivers**
- Browse available ride requests
- Apply to ride requests
- Manage ride applications
- Track earnings and ride history
- Contact passengers

### 👨‍💼 **For Administrators**
- Monitor system statistics
- Manage user accounts
- View ride analytics
- System administration tools

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **Date-fns** - Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend services running (see backend README)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── LoadingSpinner.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── RideRequest.js
│   │   ├── RideBrowse.js
│   │   ├── Profile.js
│   │   └── AdminDashboard.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Key Components

### Authentication Context (`AuthContext.js`)
Manages user authentication state throughout the application:
- User login/logout
- Token management
- Role-based access control
- Profile management

### Navigation (`Navbar.js`)
Responsive navigation bar with:
- Role-based menu items
- Mobile-friendly design
- User authentication status

### Pages

#### Home (`Home.js`)
Landing page with:
- Hero section
- Feature highlights
- Statistics
- Call-to-action buttons

#### Login (`Login.js`)
User authentication with:
- Form validation
- Error handling
- Password visibility toggle

#### Register (`Register.js`)
User registration with:
- Role selection (Passenger/Driver)
- Form validation
- Conditional fields based on role

#### Dashboard (`Dashboard.js`)
User dashboard showing:
- Welcome message
- Quick actions
- Statistics
- Recent rides

#### Ride Request (`RideRequest.js`)
For passengers to:
- Post new ride requests
- Set pickup/dropoff locations
- Specify timing and fare
- Add notes

#### Ride Browse (`RideBrowse.js`)
For drivers to:
- View available ride requests
- Apply to rides
- Filter by status
- View passenger details

#### Profile (`Profile.js`)
User profile management:
- View/edit personal information
- Update contact details
- View statistics

#### Admin Dashboard (`AdminDashboard.js`)
Administrative interface:
- System statistics
- User management
- Ride monitoring
- Account activation/deactivation

## Styling

The application uses **Styled Components** for consistent and maintainable styling:

- Modern design with gradients and shadows
- Responsive layout for all screen sizes
- Consistent color scheme and typography
- Smooth animations and transitions
- Accessible design patterns

## API Integration

The frontend communicates with the backend microservices:

- **User Service** - Authentication and user management
- **Ride Service** - Ride requests and applications
- **Payment Service** - Payment processing
- **Admin Service** - Administrative functions

## State Management

- **React Context** for global state (authentication)
- **Local State** for component-specific data
- **Axios** for API communication
- **React Router** for navigation state

## Security Features

- JWT token authentication
- Role-based access control
- Secure API communication
- Input validation and sanitization
- Protected routes

## Performance Optimizations

- Lazy loading of components
- Optimized bundle size
- Efficient re-renders
- Cached API responses
- Responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- ESLint configuration included
- Prettier formatting
- Consistent naming conventions
- Component-based architecture

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Environment Setup

Ensure all environment variables are properly configured for production:

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_MAPBOX_TOKEN=your_production_mapbox_token
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the backend documentation
- Review the API endpoints
- Contact the development team

---

**Note**: This frontend is designed to work with the RideShare backend microservices. Ensure all backend services are running before starting the frontend application. 