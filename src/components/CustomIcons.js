/**
 * Custom Leaflet Icons for Emergency Medical System
 * Professional healthcare-themed markers with SVG icons
 */

import L from 'leaflet';
import { getSeverityByCount, COLORS } from '../config/colors';

/**
 * Create hospital marker icon with badge
 * @param {number} ambulanceCount - Number of ambulances at this hospital
 * @param {boolean} isHovered - Hover state
 * @param {boolean} isFollowing - Following state (target lock mode)
 * @returns {L.DivIcon} Leaflet div icon
 */
export const createHospitalIcon = (
  ambulanceCount,
  isHovered = false,
  isFollowing = false
) => {
  const opacity = isFollowing || isHovered ? 1 : 0.7;
  const scale = isFollowing
    ? 'scale(1.15)'
    : isHovered
      ? 'scale(1.05)'
      : 'scale(1)';
  const boxShadow = isFollowing
    ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
    : `0 2px 8px ${COLORS.ui.shadow}`;
  const border = isFollowing ? '3px solid #FFD700' : '3px solid white';

  return L.divIcon({
    className: 'custom-hospital-icon',
    html: `
      <div style="opacity: ${opacity}; transition: all 0.2s ease; transform: ${scale};">
        <div style="
          width: 40px;
          height: 40px;
          background: ${COLORS.hospital.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${boxShadow};
          border: ${border};
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        ${
          ambulanceCount > 0
            ? `
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            background: ${COLORS.hospital.badge};
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: 2px solid white;
          ">${ambulanceCount}</div>
        `
            : ''
        }
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

/**
 * Create ambulance marker icon
 * @param {string} status - Ambulance status ('idle' or 'en_route')
 * @param {boolean} isHovered - Hover state
 * @param {boolean} isFollowing - Following state (target lock mode)
 * @returns {L.DivIcon} Leaflet div icon
 */
export const createAmbulanceIcon = (
  status,
  isHovered = false,
  isFollowing = false
) => {
  const color =
    status === 'idle' ? COLORS.ambulance.idle : COLORS.ambulance.enRoute;
  const opacity = isFollowing || isHovered ? 1 : 0.7;
  const scale = isFollowing
    ? 'scale(1.2)'
    : isHovered
      ? 'scale(1.1)'
      : 'scale(1)';
  const boxShadow = isFollowing
    ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
    : `0 2px 8px ${COLORS.ui.shadow}`;
  const border = isFollowing ? '3px solid #FFD700' : '3px solid white';

  return L.divIcon({
    className: 'custom-ambulance-icon',
    html: `
      <div style="opacity: ${opacity}; transition: all 0.2s ease; transform: ${scale};">
        <div style="
          width: 36px;
          height: 36px;
          background: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${boxShadow};
          border: ${border};
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h5l3 3v5h-8V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
            <path d="M5 11h4"/>
            <path d="M7 9v4"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

/**
 * Create discovery point marker icon with severity-based color
 * @param {number} peopleCount - Number of people at incident
 * @param {boolean} isHovered - Hover state
 * @param {boolean} isFollowing - Following state (target lock mode)
 * @returns {L.DivIcon} Leaflet div icon
 */
export const createDiscoveryIcon = (
  peopleCount,
  isHovered = false,
  isFollowing = false
) => {
  const config = getSeverityByCount(peopleCount);
  const opacity = isFollowing || isHovered ? 1 : 0.7;
  const scale = isFollowing
    ? 'scale(1.25)'
    : isHovered
      ? 'scale(1.15)'
      : 'scale(1)';
  const boxShadow = isFollowing
    ? '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4), 0 4px 12px rgba(0,0,0,0.3), 0 0 0 4px rgba(255, 215, 0, 0.3)'
    : `0 4px 12px ${COLORS.ui.shadow}, 0 0 0 4px rgba(255,255,255,0.5)`;
  const border = isFollowing ? '3px solid #FFD700' : '3px solid white';

  // Display format: actual number + range label
  const displayText = `${peopleCount}人 (${config.label})`;

  return L.divIcon({
    className: 'custom-discovery-icon',
    html: `
      <div style="opacity: ${opacity}; transition: all 0.2s ease; transform: ${scale};">
        <div style="
          width: 44px;
          height: 44px;
          background: ${config.gradient};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${boxShadow};
          border: ${border};
          position: relative;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: ${config.badge};
          color: white;
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">${displayText}</div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -34],
  });
};

// Legacy export for backward compatibility
export const getPeopleCountConfig = getSeverityByCount;
