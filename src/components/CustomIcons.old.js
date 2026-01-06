import L from 'leaflet';

// Get color configuration based on people count
const getPeopleCountConfig = (count) => {
  if (count >= 10) {
    return {
      gradient: {
        start: '#374151',
        end: '#1F2937'
      },
      label: '10+',
      badgeColor: '#1F2937'
    };
  } else if (count >= 5) {
    return {
      gradient: {
        start: '#EA580C',
        end: '#C2410C'
      },
      label: '5~9',
      badgeColor: '#C2410C'
    };
  } else if (count >= 3) {
    return {
      gradient: {
        start: '#F59E0B',
        end: '#D97706'
      },
      label: '3~4',
      badgeColor: '#D97706'
    };
  } else if (count === 2) {
    return {
      gradient: {
        start: '#FB923C',
        end: '#F97316'
      },
      label: '2',
      badgeColor: '#F97316'
    };
  } else if (count === 1) {
    return {
      gradient: {
        start: '#D1D5DB',
        end: '#9CA3AF'
      },
      label: '1',
      badgeColor: '#9CA3AF'
    };
  } else {
    return {
      gradient: {
        start: '#E5E7EB',
        end: '#D1D5DB'
      },
      label: '0',
      badgeColor: '#D1D5DB'
    };
  }
};

// Inline SVG icons
const hospitalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <defs>
    <linearGradient id="hospitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0891B2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0E7490;stop-opacity:1" />
    </linearGradient>
    <filter id="hospitalShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="20" cy="20" r="18" fill="url(#hospitalGradient)" filter="url(#hospitalShadow)"/>
  <circle cx="20" cy="20" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>
  <g transform="translate(20, 20)">
    <rect x="-2.5" y="-9" width="5" height="18" fill="#ffffff" rx="1"/>
    <rect x="-9" y="-2.5" width="18" height="5" fill="#ffffff" rx="1"/>
  </g>
  <text x="20" y="34" font-family="Poppins, sans-serif" font-size="8" font-weight="700" text-anchor="middle" fill="#ffffff">H</text>
</svg>`;

const ambulanceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <defs>
    <linearGradient id="ambulanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B91C1C;stop-opacity:1" />
    </linearGradient>
    <filter id="ambulanceShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <circle cx="20" cy="20" r="18" fill="url(#ambulanceGradient)" filter="url(#ambulanceShadow)"/>
  <circle cx="20" cy="20" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>
  <g transform="translate(20, 20)">
    <rect x="-8" y="-4" width="14" height="7" fill="#ffffff" rx="1"/>
    <rect x="6" y="-3" width="4" height="5" fill="#ffffff" rx="0.5"/>
    <rect x="-2" y="-6" width="4" height="1.5" fill="#FEF3C7" rx="0.5"/>
    <rect x="-4" y="-1.5" width="1.2" height="3.5" fill="#DC2626"/>
    <rect x="-5.1" y="-0.4" width="3.4" height="1.2" fill="#DC2626"/>
    <circle cx="-5" cy="4" r="1.5" fill="#374151"/>
    <circle cx="5" cy="4" r="1.5" fill="#374151"/>
  </g>
</svg>`;

// Create icons with opacity support
export const createAmbulanceIcon = (isHovered = false) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div class="ambulance-marker ${isHovered ? 'hovered' : ''}">${ambulanceSvg}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 25],
    popupAnchor: [0, -25]
  });
};

export const createDiscoveryIcon = (peopleCount = 0, isHovered = false) => {
  const config = getPeopleCountConfig(peopleCount);
  const discoverySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <defs>
      <linearGradient id="discoveryGradient-${peopleCount}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${config.gradient.start};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${config.gradient.end};stop-opacity:1" />
      </linearGradient>
      <filter id="discoveryShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#discoveryGradient-${peopleCount})" filter="url(#discoveryShadow)"/>
    <circle cx="20" cy="20" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>
    <g transform="translate(20, 12)">
      <path d="M 0,-8 C -4,-8 -7,-5 -7,-1 C -7,3 0,10 0,10 C 0,10 7,3 7,-1 C 7,-5 4,-8 0,-8 Z" fill="#ffffff"/>
      <circle cx="0" cy="-1" r="2.5" fill="${config.gradient.end}"/>
    </g>
    <g transform="translate(20, 28)">
      <rect x="-1" y="-3" width="2" height="2" fill="#ffffff" rx="0.3"/>
      <circle cx="0" cy="0" r="0.8" fill="#ffffff"/>
    </g>
  </svg>`;
  
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container ${isHovered ? 'hovered' : ''}">
        <div class="discovery-marker ${isHovered ? 'hovered' : ''}">${discoverySvg}</div>
        ${peopleCount > 0 ? `<span class="marker-badge" style="background: linear-gradient(135deg, ${config.badgeColor} 0%, ${config.gradient.end} 100%);">${config.label}</span>` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 25],
    popupAnchor: [0, -25]
  });
};

export const createHospitalIconWithBadge = (count, isHovered = false) => {
  return new L.DivIcon({
    className: 'custom-hospital-marker',
    html: `
      <div class="marker-container ${isHovered ? 'hovered' : ''}">
        <div class="hospital-marker">${hospitalSvg}</div>
        ${count > 0 ? `<span class="marker-badge">${count}</span>` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 25],
    popupAnchor: [0, -25]
  });
};
