/**
 * Color Configuration for Healthcare Emergency System
 * Professional palette following healthcare industry standards
 */

export const COLORS = {
  // People count severity levels (Gray scale + Orange/Yellow for severity)
  severity: {
    none: {
      gradient: 'linear-gradient(135deg, #E5E7EB 0%, #D1D5DB 100%)', // Very light gray (0 people)
      badge: '#9CA3AF',
      label: '0',
    },
    low: {
      gradient: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)', // Light gray (1 person)
      badge: '#6B7280',
      label: '1',
    },
    moderate: {
      gradient: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)', // Light orange (2 people)
      badge: '#FB923C',
      label: '2',
    },
    moderateHigh: {
      gradient: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)', // Dark yellow (3-4 people)
      badge: '#F59E0B',
      label: '3~4',
    },
    high: {
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', // Dark orange (5-9 people)
      badge: '#EA580C',
      label: '5~9',
    },
    critical: {
      gradient: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)', // Dark gray (10+ people)
      badge: '#1F2937',
      label: '10+',
    },
  },

  // Route priority colors
  priority: {
    critical: '#EA580C', // Orange-red
    high: '#DC2626', // Red
    medium: '#0891B2', // Cyan
    low: '#059669', // Green
  },

  // Hospital marker
  hospital: {
    primary: '#2563EB', // Professional blue
    hover: '#1D4ED8',
    badge: '#DC2626', // Red for count badge
  },

  // Ambulance marker
  ambulance: {
    idle: '#10B981', // Green when idle
    enRoute: '#F59E0B', // Amber when responding
    hover: '#059669',
  },

  // UI elements
  ui: {
    background: '#F8FAFC',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    border: '#E2E8F0',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#64748B',
    },
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
};

/**
 * Get severity configuration based on people count
 * @param {number} count - Number of people
 * @returns {Object} Severity configuration
 */
export const getSeverityByCount = (count) => {
  if (count >= 10) return COLORS.severity.critical;
  if (count >= 5) return COLORS.severity.high;
  if (count >= 3) return COLORS.severity.moderateHigh;
  if (count === 2) return COLORS.severity.moderate;
  if (count === 1) return COLORS.severity.low;
  return COLORS.severity.none;
};
