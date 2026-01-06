# Emergency Medical Service - Code Structure

## 📁 Project Organization

### Configuration Files (`src/config/`)
Centralized configuration for maintainability and consistency.

- **`colors.js`** - Healthcare color palette and severity levels
  - Severity colors (Green → Yellow → Orange → Red)
  - Hospital/Ambulance/Route colors
  - UI theme colors (text, background, borders)
  - Helper function: `getSeverityByCount()`

- **`constants.js`** - Application constants
  - Map configuration (center, zoom levels)
  - Simulation defaults
  - Incident types and location names (Tokyo/Hamamatsu)
  - Geographic boundaries
  - Filter options

### Utilities (`src/utils/`)
Pure functions for simulation logic.

- **`simulationHelpers.js`** - Core simulation functions
  - `generateRandomDiscovery()` - Create random incidents
  - `generateAmbulanceForDiscovery()` - Smart dispatch (nearest idle ambulance)
  - `createRoute()` - Route object creation
  - `moveAmbulanceAlongRoute()` - Movement logic with phases
  - `initializeAmbulances()` - Ambulance pool initialization

### Components (`src/components/`)
Modular React components following Container/Presenter pattern.

- **`CustomIcons.js`** - Leaflet icon generators
  - `createHospitalIcon()` - Hospital markers with badges
  - `createAmbulanceIcon()` - Status-based ambulance markers
  - `createDiscoveryIcon()` - Severity-based incident markers

- **`HospitalMarker.js`** - Hospital marker component
- **`AmbulanceMarker.js`** - Ambulance marker component
- **`DiscoveryMarker.js`** - Discovery point marker component
- **`RoutePolyline.js`** - Route visualization component
- **`Sidebar.js`** - Control panel with filters/settings
- **`MapLayers.js`** - Map layer management

### Main Application (`src/`)

- **`App.js`** - Main application logic
  - State management
  - Simulation loop
  - Filter logic
  - Event handlers
  
- **`App.css`** - Professional healthcare design system
  - CSS variables for consistent theming
  - Medical Blue primary color (#2563EB)
  - Clean, accessible UI components

## 🎨 Design System

### Colors
- **Primary**: Medical Blue (#2563EB) - Professional, trustworthy
- **Emergency**: Red (#DC2626) - Urgency, critical
- **Success**: Green (#059669) - Healthy, safe
- **Warning**: Amber (#F59E0B) - Caution

### Severity Levels
1. **Critical** (10+ people) - Dark Red gradient
2. **High** (5-9 people) - Red gradient
3. **Moderate-High** (3-4 people) - Orange gradient
4. **Moderate** (2 people) - Amber gradient
5. **Low** (1 person) - Blue gradient
6. **None** (0 people) - Green gradient

## 🔄 Simulation Flow

1. **Initialization**
   - Create fixed ambulance pool (configurable per hospital + independent)
   - All ambulances start in idle patrol mode

2. **Idle Phase**
   - Random patrol movement around home hospital
   - Check for incident creation based on idle time
   - 30% chance per check when idle time threshold met

3. **Dispatch Phase** (to_discovery)
   - Find nearest idle ambulance
   - Move ambulance to incident location
   - No route displayed during this phase

4. **Transport Phase** (to_hospital)
   - Patient picked up
   - Route polyline displayed
   - Move to nearest hospital

5. **Return to Idle**
   - Arrive at hospital
   - Remove route and discovery point
   - Reset to idle patrol

## 🎯 Key Features

- **Smart Dispatch**: Nearest idle ambulance algorithm
- **Realistic Patrol**: Random movement within area (not circular)
- **Phase-based Routes**: Only show routes during patient transport
- **Auto Cleanup**: Remove completed incidents when ambulance arrives
- **Configurable Settings**: Ambulances, incidents, idle times all adjustable
- **Professional UI**: Healthcare industry color standards
- **Accessibility**: Proper contrast ratios, focus states, keyboard navigation

## 📊 Performance

- Optimized state updates with useCallback
- Efficient filtering with single-pass algorithms
- Minimal re-renders with proper key props
- Interval-based simulation (1000ms / speed multiplier)

## 🛠️ Best Practices Applied

✅ Separation of concerns (config, utils, components)
✅ Pure functions for business logic
✅ Professional healthcare color palette
✅ Consistent naming conventions
✅ Comprehensive inline documentation
✅ Accessible UI components
✅ Smooth transitions (200ms)
✅ Proper hover states without layout shift
✅ SVG icons (no emojis in UI)
✅ Responsive design considerations

## 🚀 Future Improvements

- [ ] Add TypeScript for type safety
- [ ] Implement React.memo for performance
- [ ] Add unit tests for simulation helpers
- [ ] Persistent state with localStorage
- [ ] Historical data playback
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode support
