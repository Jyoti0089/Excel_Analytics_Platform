# Excel Analytics Platform - Frontend

This is the React.js frontend for the Excel Analytics Platform, a comprehensive MERN stack application for uploading, analyzing, and visualizing Excel data.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes

### 📊 Data Visualization
- Interactive chart creation with Chart.js
- 5 chart types: Bar, Line, Pie, Doughnut, Scatter
- Dynamic axis selection
- Multiple color schemes
- Real-time chart updates

### 📤 File Management
- Drag-and-drop Excel file upload
- File validation and preview
- Support for .xlsx and .xls formats
- Data preview with pagination

### 💾 Analysis Management
- Save chart configurations
- Analysis history tracking
- Search and filter capabilities
- Data insights and statistics

### 👥 Admin Features
- User management dashboard
- System statistics monitoring
- Role assignment functionality

## Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js & React-ChartJS-2** - Data visualization
- **Tailwind CSS** - Styling framework
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library
- **React Dropzone** - File upload
- **React Hot Toast** - Notifications

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Environment Setup

Make sure your backend server is running on `http://localhost:5000` or update the proxy in `package.json`.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Admin/           # Admin panel components
│   ├── Analyze/         # Data analysis components
│   ├── Auth/            # Authentication components
│   ├── Dashboard/       # Dashboard components
│   ├── ErrorBoundary/   # Error handling
│   ├── History/         # Analysis history
│   ├── Layout/          # Layout components
│   ├── UI/              # Base UI components
│   └── Upload/          # File upload components
├── contexts/            # React contexts
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Key Components

### Authentication
- `Login.js` - User login form
- `Register.js` - User registration form

### Data Analysis
- `Analyze.js` - Main analysis page
- `Chart.js` - Chart rendering component
- `ChartControls.js` - Chart configuration
- `DataInsights.js` - Statistical insights

### File Management
- `Upload.js` - File upload interface
- Support for drag-and-drop functionality

### UI Components
- `Button.js` - Reusable button component
- `Input.js` - Form input component
- `Card.js` - Container component
- `Modal.js` - Modal dialog component
- `Alert.js` - Notification component
- `LoadingSpinner.js` - Loading indicator

### Admin Panel
- `AdminPanel.js` - Complete admin dashboard
- User management and system monitoring

## Features in Detail

### Chart Creation
1. Upload Excel file
2. Select chart type (Bar, Line, Pie, Doughnut, Scatter)
3. Choose X and Y axes from column headers
4. Select color scheme
5. Generate interactive chart
6. Save analysis for future reference

### Data Insights
- Automatic statistical calculations
- Count, Sum, Average, Median
- Maximum, Minimum, Range
- Quartile analysis
- Trend detection

### Admin Features
- View all users and their roles
- Promote/demote admin privileges
- System statistics dashboard
- Monitor platform usage

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Support

Supports all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details