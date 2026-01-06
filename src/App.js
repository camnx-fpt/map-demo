/**
 * Emergency Medical Service Dispatch System
 * Real-time ambulance tracking and incident management
 */

import React, { useState, useEffect } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "./App.css";

// Data
import { hospitals } from "./data/mockData";

// Components
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
import SettingsModal from "./components/SettingsModal";
import LanguageSwitcher from "./components/LanguageSwitcher";
import MapLayers from "./components/MapLayers";
import HospitalMarker from "./components/HospitalMarker";
import AmbulanceMarker from "./components/AmbulanceMarker";
import DiscoveryMarker from "./components/DiscoveryMarker";
import RoutePolyline from "./components/RoutePolyline";

// Utilities
import {
  generateRandomDiscovery,
  generateAmbulanceForDiscovery,
  createRoute,
  moveAmbulanceAlongRoute,
  initializeAmbulances,
} from "./utils/simulationHelpers";
import { loadSettings, saveSettings } from "./utils/localStorage";

// Configuration
import {
  MAP_CONFIG,
  SIMULATION_DEFAULTS,
  PROBABILITY,
} from "./config/constants";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Filter states
  const [filters, setFilters] = useState({
    hospitals: true,
    ambulances: true,
    discoveryPoints: true,
    routes: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredHospital, setHoveredHospital] = useState(null);
  const [peopleCountFilter, setPeopleCountFilter] = useState("all");
  const [showOnlyEnRoute, setShowOnlyEnRoute] = useState(false);
  const [showOnlyIdle, setShowOnlyIdle] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simulation settings
  const [settings, setSettings] = useState(() =>
    loadSettings(SIMULATION_DEFAULTS),
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [dynamicAmbulances, setDynamicAmbulances] = useState([]);
  const [dynamicDiscoveryPoints, setDynamicDiscoveryPoints] = useState([]);
  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [nextId, setNextId] = useState({ discovery: 1, route: 1 });

  // ============================================================================
  // FILTER HANDLERS
  // ============================================================================

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filterData = (data, type) => {
    let filtered = data;

    // Apply people count filter for discovery points
    if (type === "discovery" && peopleCountFilter !== "all") {
      filtered = filtered.filter((item) => {
        const count = item.peopleCount || 0;
        switch (peopleCountFilter) {
          case "10+":
            return count >= 10;
          case "5-9":
            return count >= 5 && count <= 9;
          case "3-4":
            return count >= 3 && count <= 4;
          case "2":
            return count === 2;
          case "1":
            return count === 1;
          case "0":
            return count === 0;
          default:
            return true;
        }
      });
    }

    // Apply status filters for ambulances
    if (type === "ambulance") {
      if (showOnlyEnRoute) {
        filtered = filtered.filter((item) => item.status === "en_route");
      }
      if (showOnlyIdle) {
        filtered = filtered.filter((item) => item.status === "idle");
      }
    }

    return filtered;
  };

  // ============================================================================
  // ROUTE HELPERS
  // ============================================================================

  const getRouteCoordinates = (route) => {
    const discovery = dynamicDiscoveryPoints.find(
      (d) => d.id === route.discoveryPointId,
    );
    const ambulance = dynamicAmbulances.find((a) => a.id === route.ambulanceId);
    const hospital = hospitals.find((h) => h.id === route.hospitalId);

    if (!ambulance || !hospital) return null;

    // Phase: At discovery point - show connection between ambulance and discovery
    if (ambulance.phase === "at_discovery" && discovery) {
      return {
        segment1: [
          [ambulance.lat, ambulance.lng],
          [discovery.lat, discovery.lng],
        ],
        segment2: null,
      };
    }

    // Phase: Transporting to hospital - show route to hospital
    if (ambulance.phase === "to_hospital") {
      return {
        segment1: null,
        segment2: [
          [ambulance.lat, ambulance.lng],
          [hospital.lat, hospital.lng],
        ],
      };
    }

    return null;
  };

  const handleRouteHover = () => {
    // Route hover is now managed by RoutePolyline component
  };

  const handleHospitalHover = (hospitalId, isHovering) => {
    setHoveredHospital(isHovering ? hospitalId : null);
  };

  // ============================================================================
  // SIMULATION LOGIC
  // ============================================================================

  /**
   * Main simulation loop
   */
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Move all ambulances (including idle patrol)
      setDynamicAmbulances((prev) => {
        return prev.map((amb) => {
          const discovery = dynamicDiscoveryPoints.find(
            (d) => d.id === amb.targetDiscoveryId,
          );
          const hospital = hospitals.find((h) => h.id === amb.targetHospitalId);

          // Callback when ambulance arrives at hospital
          const onArriveAtHospital = (discoveryId) => {
            setTimeout(() => {
              setDynamicRoutes((prevRoutes) =>
                prevRoutes.filter((r) => r.discoveryPointId !== discoveryId),
              );
              setDynamicDiscoveryPoints((prevPoints) =>
                prevPoints.filter((d) => d.id !== discoveryId),
              );
            }, 0);
          };

          return moveAmbulanceAlongRoute(
            amb,
            discovery,
            hospital,
            simulationSpeed,
            onArriveAtHospital,
          );
        });
      });

      // Auto-dispatch idle ambulances to waiting incidents
      setDynamicAmbulances((prev) => {
        const idleAmbulances = prev.filter((a) => a.status === "idle");

        // Get incidents that don't have ambulances assigned
        const assignedDiscoveryIds = prev
          .filter((a) => a.status === "en_route" && a.targetDiscoveryId)
          .map((a) => a.targetDiscoveryId);

        const waitingDiscoveries = dynamicDiscoveryPoints.filter(
          (d) => !assignedDiscoveryIds.includes(d.id),
        );

        // Dispatch idle ambulances to waiting incidents
        waitingDiscoveries.forEach((discovery) => {
          const dispatchInfo = generateAmbulanceForDiscovery(
            discovery,
            prev,
            hospitals,
          );

          if (dispatchInfo) {
            setNextId((prevId) => {
              const newRoute = createRoute(
                discovery.id,
                dispatchInfo.ambulanceId,
                dispatchInfo.hospitalId,
                prevId.route,
              );

              setDynamicRoutes((prevR) => [...prevR, newRoute]);

              // Dispatch ambulance
              setDynamicAmbulances((prevA) =>
                prevA.map((a) =>
                  a.id === dispatchInfo.ambulanceId
                    ? {
                        ...a,
                        status: "en_route",
                        phase: "to_discovery",
                        targetDiscoveryId: discovery.id,
                        targetHospitalId: dispatchInfo.hospitalId,
                      }
                    : a,
                ),
              );

              return {
                ...prevId,
                route: prevId.route + 1,
              };
            });
          }
        });

        // Create new incidents for idle ambulances
        idleAmbulances.forEach((amb) => {
          const idleTime = (now - amb.idleStartTime) / 1000; // seconds
          const shouldCreateIncident =
            idleTime >=
            settings.minIdleTime +
              Math.random() * (settings.maxIdleTime - settings.minIdleTime);

          // Check if we've reached max incidents
          if (dynamicDiscoveryPoints.length >= settings.maxIncidents) {
            return;
          }

          if (
            shouldCreateIncident &&
            Math.random() < PROBABILITY.incidentCreation
          ) {
            setNextId((prevId) => {
              const newDiscovery = generateRandomDiscovery(prevId.discovery);
              const dispatchInfo = generateAmbulanceForDiscovery(
                newDiscovery,
                prev,
                hospitals,
              );

              if (dispatchInfo) {
                const newRoute = createRoute(
                  newDiscovery.id,
                  dispatchInfo.ambulanceId,
                  dispatchInfo.hospitalId,
                  prevId.route,
                );

                setDynamicDiscoveryPoints((prevD) => [...prevD, newDiscovery]);
                setDynamicRoutes((prevR) => [...prevR, newRoute]);

                // Dispatch ambulance
                setDynamicAmbulances((prevA) =>
                  prevA.map((a) =>
                    a.id === dispatchInfo.ambulanceId
                      ? {
                          ...a,
                          status: "en_route",
                          phase: "to_discovery",
                          targetDiscoveryId: newDiscovery.id,
                          targetHospitalId: dispatchInfo.hospitalId,
                        }
                      : a,
                  ),
                );
              }

              return {
                discovery: prevId.discovery + 1,
                route: prevId.route + 1,
              };
            });
          }
        });

        return prev;
      });
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [
    isSimulating,
    simulationSpeed,
    dynamicDiscoveryPoints,
    dynamicRoutes,
    settings.maxIncidents,
    settings.minIdleTime,
    settings.maxIdleTime,
  ]);

  /**
   * Toggle simulation on/off
   */
  const toggleSimulation = () => {
    if (!isSimulating) {
      // Initialize ambulances with current settings
      const newAmbulances = initializeAmbulances(
        hospitals,
        settings.ambulancesPerHospital,
        settings.independentAmbulances,
      );
      setDynamicAmbulances(newAmbulances);
      setDynamicDiscoveryPoints([]);
      setDynamicRoutes([]);
      setNextId({ discovery: 1, route: 1 });
    }
    setIsSimulating(!isSimulating);
  };

  /**
   * Reset simulation to initial state
   */
  const resetSimulation = () => {
    setIsSimulating(false);
    setDynamicAmbulances([]);
    setDynamicDiscoveryPoints([]);
    setDynamicRoutes([]);
    setNextId({ discovery: 1, route: 1 });
    setSimulationSpeed(1);
  };

  /**
   * Update simulation settings (kept for future use)
   */
  // eslint-disable-next-line no-unused-vars
  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: parseInt(value) || 0,
    }));
  };

  /**
   * Save settings to localStorage
   */
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // ============================================================================
  // DATA FILTERING
  // ============================================================================

  const filteredHospitals = filterData(hospitals, "hospital");
  const filteredAmbulances = filterData(dynamicAmbulances, "ambulance");
  const filteredDiscoveryPoints = filterData(
    dynamicDiscoveryPoints,
    "discovery",
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="app-container">
      {/* Mobile: Floating button + Bottom sheet */}
      {isMobile ? (
        <>
          <button
            className="sidebar-toggle-mobile"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={
              isSidebarOpen ? "サイドバーを閉じる" : "サイドバーを開く"
            }
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>

          <MobileSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            peopleCountFilter={peopleCountFilter}
            onPeopleCountChange={setPeopleCountFilter}
            showOnlyEnRoute={showOnlyEnRoute}
            onEnRouteChange={setShowOnlyEnRoute}
            showOnlyIdle={showOnlyIdle}
            onIdleChange={setShowOnlyIdle}
            isSimulating={isSimulating}
            onToggleSimulation={toggleSimulation}
            simulationSpeed={simulationSpeed}
            onSpeedChange={setSimulationSpeed}
            onReset={resetSimulation}
            onOpenSettings={() => setIsSettingsOpen(true)}
            stats={{
              hospitals: filteredHospitals.length,
              ambulances: filteredAmbulances.length,
              discoveryPoints: filteredDiscoveryPoints.length,
              activeRoutes: dynamicRoutes.length,
            }}
          />
        </>
      ) : (
        /* Desktop: Fixed sidebar */
        <div className="sidebar desktop-sidebar">
          <Sidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            peopleCountFilter={peopleCountFilter}
            onPeopleCountChange={setPeopleCountFilter}
            showOnlyEnRoute={showOnlyEnRoute}
            onEnRouteChange={setShowOnlyEnRoute}
            showOnlyIdle={showOnlyIdle}
            onIdleChange={setShowOnlyIdle}
            isSimulating={isSimulating}
            onToggleSimulation={toggleSimulation}
            simulationSpeed={simulationSpeed}
            onSpeedChange={setSimulationSpeed}
            onReset={resetSimulation}
            onOpenSettings={() => setIsSettingsOpen(true)}
            stats={{
              hospitals: filteredHospitals.length,
              ambulances: filteredAmbulances.length,
              discoveryPoints: filteredDiscoveryPoints.length,
              activeRoutes: dynamicRoutes.length,
            }}
          />
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <LanguageSwitcher />

      <div className="map-wrapper">
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <MapLayers />

          {/* Hospital markers */}
          {filters.hospitals &&
            filteredHospitals.map((hospital) => {
              const relatedRoutes = dynamicRoutes.filter(
                (r) => r.hospitalId === hospital.id,
              );
              const ambulanceCount = relatedRoutes.length;

              return (
                <HospitalMarker
                  key={hospital.id}
                  hospital={hospital}
                  ambulanceCount={ambulanceCount}
                  onHover={handleHospitalHover}
                />
              );
            })}

          {/* Ambulance markers */}
          {filters.ambulances &&
            filteredAmbulances.map((ambulance) => {
              const relatedRoute = dynamicRoutes.find(
                (r) => r.ambulanceId === ambulance.id,
              );
              return (
                <AmbulanceMarker
                  key={ambulance.id}
                  ambulance={ambulance}
                  relatedRoute={relatedRoute}
                  onHover={handleRouteHover}
                />
              );
            })}

          {/* Discovery point markers */}
          {filters.discoveryPoints &&
            filteredDiscoveryPoints.map((point) => {
              const relatedRoute = dynamicRoutes.find(
                (r) => r.discoveryPointId === point.id,
              );
              return (
                <DiscoveryMarker
                  key={point.id}
                  point={point}
                  relatedRoute={relatedRoute}
                  onHover={handleRouteHover}
                />
              );
            })}

          {/* Route polylines - only show when ambulance has picked up patient */}
          {filters.routes &&
            dynamicRoutes.map((route) => {
              const ambulance = dynamicAmbulances.find(
                (a) => a.id === route.ambulanceId,
              );
              // Only show route if ambulance is transporting (to_hospital phase)
              if (!ambulance || ambulance.phase !== "to_hospital") return null;

              const coordinates = getRouteCoordinates(route);
              const isHoveredViaHospital = hoveredHospital === route.hospitalId;

              return (
                <RoutePolyline
                  key={route.id}
                  route={route}
                  coordinates={coordinates}
                  isHoveredViaHospital={isHoveredViaHospital}
                  onHover={handleRouteHover}
                />
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
