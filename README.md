# 日本病院マップ - Japan Hospital Map

React.js application using Leaflet to display hospitals, ambulances, and emergency routes in Japan.

## Features

- 🗺️ Interactive map using Leaflet
- 🏥 Hospital locations with custom icons
- 🚑 Ambulance tracking
- 📍 Discovery/incident points
- 🔗 Polygon routes connecting discovery point → ambulance → hospital
- 🔍 Search functionality for hospitals and ambulances
- ✅ Layer filtering with checkboxes

## Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

## Running the Application

```bash
# Start development server
npm start

# Or using yarn
yarn start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── App.js              # Main application component
├── App.css             # Application styles
├── index.js            # Entry point
├── index.css           # Global styles
└── data/
    └── mockData.js     # Mock data for hospitals, ambulances, and routes

public/
├── index.html          # HTML template
└── assets/
    └── ic-circle-hospital.svg  # Hospital icon
```

## Mock Data

The application includes mock data for:
- 8 hospitals in Tokyo area
- 4 ambulances
- 4 discovery/incident points
- 4 routes connecting discovery points to hospitals via ambulances

## Usage

1. **Filter Layers**: Use checkboxes in the sidebar to toggle visibility of hospitals, ambulances, discovery points, and routes
2. **Search**: Enter hospital name or ambulance vehicle number in the search box
3. **View Details**: Click on any marker to see detailed information in a popup

## Technologies

- React 18.3.0
- React Leaflet 4.2.1
- Leaflet 1.9.4
- React Scripts 5.0.1

## License

MIT
