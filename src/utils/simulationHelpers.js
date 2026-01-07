/**
 * Simulation Helper Functions
 */

import {
  INCIDENT_TYPES,
  TOKYO_AREAS,
  HAMAMATSU_AREAS,
  LOCATION_SUFFIXES,
  GEO_BOUNDS,
  PROBABILITY,
  ROUTE_PRIORITIES,
} from '../config/constants';
import { COLORS } from '../config/colors';

/**
 * Generate random discovery point
 * @param {number} id - Discovery point ID
 * @returns {Object} Discovery point data
 */
export const generateRandomDiscovery = (id) => {
  const isTokyoArea = Math.random() < PROBABILITY.tokyoArea;

  let randomLat, randomLng, areaName;
  if (isTokyoArea) {
    const { lat, lng } = GEO_BOUNDS.tokyo;
    randomLat = lat.min + Math.random() * (lat.max - lat.min);
    randomLng = lng.min + Math.random() * (lng.max - lng.min);
    areaName = TOKYO_AREAS[Math.floor(Math.random() * TOKYO_AREAS.length)];
  } else {
    const { lat, lng } = GEO_BOUNDS.hamamatsu;
    randomLat = lat.min + Math.random() * (lat.max - lat.min);
    randomLng = lng.min + Math.random() * (lng.max - lng.min);
    areaName =
      HAMAMATSU_AREAS[Math.floor(Math.random() * HAMAMATSU_AREAS.length)];
  }

  return {
    id: `d${id}`,
    name: `${areaName}${
      LOCATION_SUFFIXES[Math.floor(Math.random() * LOCATION_SUFFIXES.length)]
    }`,
    lat: randomLat,
    lng: randomLng,
    incidentType:
      INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)],
    time: new Date().toLocaleString('ja-JP'),
    peopleCount: Math.floor(Math.random() * 15),
  };
};

/**
 * Find nearest idle ambulance and assign to discovery point
 * @param {Object} discoveryPoint - Discovery point data
 * @param {Array} availableAmbulances - List of ambulances
 * @param {Array} hospitals - List of hospitals
 * @returns {Object|null} Dispatch information
 */
export const generateAmbulanceForDiscovery = (
  discoveryPoint,
  availableAmbulances,
  hospitals
) => {
  const idleAmbulances = availableAmbulances.filter((a) => a.status === 'idle');

  if (idleAmbulances.length === 0) return null;

  // Find nearest idle ambulance
  const nearest = idleAmbulances.reduce(
    (nearest, amb) => {
      const dist = calculateDistance(amb, discoveryPoint);
      return dist < nearest.dist ? { ambulance: amb, dist } : nearest;
    },
    { ambulance: null, dist: Infinity }
  );

  if (!nearest.ambulance) return null;

  // Find nearest hospital to discovery point
  const nearestHospital = hospitals.reduce(
    (nearest, h) => {
      const dist = calculateDistance(h, discoveryPoint);
      return dist < nearest.dist ? { hospital: h, dist } : nearest;
    },
    { hospital: hospitals[0], dist: Infinity }
  ).hospital;

  return {
    ambulanceId: nearest.ambulance.id,
    hospitalId: nearestHospital.id,
  };
};

/**
 * Create route object
 * @param {string} discoveryId - Discovery point ID
 * @param {string} ambulanceId - Ambulance ID
 * @param {string} hospitalId - Hospital ID
 * @param {number} routeId - Route ID
 * @returns {Object} Route data
 */
export const createRoute = (discoveryId, ambulanceId, hospitalId, routeId) => {
  const priority =
    ROUTE_PRIORITIES[Math.floor(Math.random() * ROUTE_PRIORITIES.length)];

  return {
    id: `r${routeId}`,
    discoveryPointId: discoveryId,
    ambulanceId: ambulanceId,
    hospitalId: hospitalId,
    priority: priority,
    color: COLORS.priority[priority],
  };
};

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point with lat/lng
 * @param {Object} point2 - Second point with lat/lng
 * @returns {number} Distance
 */
export const calculateDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.lat - point2.lat, 2) + Math.pow(point1.lng - point2.lng, 2)
  );
};

/**
 * Move ambulance along route with different phases
 * @param {Object} ambulance - Ambulance data
 * @param {Object} discovery - Discovery point data
 * @param {Object} hospital - Hospital data
 * @param {number} speed - Movement speed multiplier
 * @param {Function} onArriveAtHospital - Callback when arriving at hospital
 * @returns {Object} Updated ambulance data
 */
export const moveAmbulanceAlongRoute = (
  ambulance,
  discovery,
  hospital,
  speed = 1,
  onArriveAtHospital
) => {
  const moveSpeed = 0.0005 * speed;
  const TIME_AT_DISCOVERY = 3000; // 3 seconds at discovery point

  // Phase 1: Idle - patrol around home hospital
  if (ambulance.phase === 'idle') {
    return updateIdlePatrol(ambulance, speed);
  }

  // Phase 2: Going to discovery point
  if (ambulance.phase === 'to_discovery') {
    // If discovery point no longer exists, reset to idle
    if (!discovery) {
      return {
        ...ambulance,
        status: 'idle',
        phase: 'idle',
        targetDiscoveryId: null,
        targetHospitalId: null,
        idleStartTime: Date.now(),
        patrolTargetLat: null,
        patrolTargetLng: null,
      };
    }
    return moveToTarget(ambulance, discovery, moveSpeed, 'at_discovery');
  }

  // Phase 3: At discovery point - wait before transporting
  if (ambulance.phase === 'at_discovery') {
    if (!ambulance.discoveryArrivalTime) {
      return {
        ...ambulance,
        discoveryArrivalTime: Date.now(),
      };
    }

    const timeAtDiscovery = Date.now() - ambulance.discoveryArrivalTime;
    if (timeAtDiscovery >= TIME_AT_DISCOVERY) {
      return {
        ...ambulance,
        phase: 'to_hospital',
        discoveryArrivalTime: null,
      };
    }

    return ambulance;
  }

  // Phase 4: Going to hospital with patient
  if (ambulance.phase === 'to_hospital') {
    // If hospital no longer exists, reset to idle
    if (!hospital) {
      return {
        ...ambulance,
        status: 'idle',
        phase: 'idle',
        targetDiscoveryId: null,
        targetHospitalId: null,
        idleStartTime: Date.now(),
        patrolTargetLat: null,
        patrolTargetLng: null,
      };
    }

    const result = moveToTarget(ambulance, hospital, moveSpeed, 'idle');

    // If arrived at hospital, trigger cleanup
    if (result.phase === 'idle' && onArriveAtHospital) {
      onArriveAtHospital(ambulance.targetDiscoveryId);
    }

    return result;
  }

  return ambulance;
};

/**
 * Update ambulance idle patrol movement
 * @param {Object} ambulance - Ambulance data
 * @param {number} speed - Movement speed multiplier
 * @returns {Object} Updated ambulance data
 */
const updateIdlePatrol = (ambulance, speed) => {
  const patrolRadius = 0.015;
  const moveDistance = 0.0003 * speed;

  // Initialize patrol target if not exists
  if (!ambulance.patrolTargetLat || !ambulance.patrolTargetLng) {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDist = Math.random() * patrolRadius;
    return {
      ...ambulance,
      patrolTargetLat:
        ambulance.homeHospitalLat + Math.cos(randomAngle) * randomDist,
      patrolTargetLng:
        ambulance.homeHospitalLng + Math.sin(randomAngle) * randomDist,
    };
  }

  const distLat = ambulance.patrolTargetLat - ambulance.lat;
  const distLng = ambulance.patrolTargetLng - ambulance.lng;
  const distance = Math.sqrt(distLat * distLat + distLng * distLng);

  // If reached target, choose new random target
  if (distance < moveDistance * 2) {
    const randomAngle = Math.random() * Math.PI * 2;
    const randomDist = Math.random() * patrolRadius;
    return {
      ...ambulance,
      lat: ambulance.lat,
      lng: ambulance.lng,
      patrolTargetLat:
        ambulance.homeHospitalLat + Math.cos(randomAngle) * randomDist,
      patrolTargetLng:
        ambulance.homeHospitalLng + Math.sin(randomAngle) * randomDist,
    };
  }

  // Move towards target
  return {
    ...ambulance,
    lat: ambulance.lat + (distLat / distance) * moveDistance,
    lng: ambulance.lng + (distLng / distance) * moveDistance,
  };
};

/**
 * Move ambulance to target location
 * @param {Object} ambulance - Ambulance data
 * @param {Object} target - Target location
 * @param {number} moveSpeed - Movement speed
 * @param {string} nextPhase - Next phase when arrived
 * @returns {Object} Updated ambulance data
 */
const moveToTarget = (ambulance, target, moveSpeed, nextPhase) => {
  const distLat = target.lat - ambulance.lat;
  const distLng = target.lng - ambulance.lng;
  const distance = Math.sqrt(distLat * distLat + distLng * distLng);

  // If arrived at target
  if (distance < moveSpeed) {
    const update = {
      ...ambulance,
      lat: target.lat,
      lng: target.lng,
      phase: nextPhase,
    };

    // If returning to idle, reset state
    if (nextPhase === 'idle') {
      update.status = 'idle';
      update.targetDiscoveryId = null;
      update.targetHospitalId = null;
      update.idleStartTime = Date.now();
      update.patrolTargetLat = null;
      update.patrolTargetLng = null;
    }

    return update;
  }

  // Move towards target
  return {
    ...ambulance,
    lat: ambulance.lat + (distLat / distance) * moveSpeed,
    lng: ambulance.lng + (distLng / distance) * moveSpeed,
  };
};

/**
 * Initialize ambulances for hospitals
 * @param {Array} hospitals - List of hospitals
 * @param {number} perHospital - Ambulances per hospital
 * @param {number} independent - Independent ambulances
 * @returns {Array} List of ambulances
 */
export const initializeAmbulances = (hospitals, perHospital, independent) => {
  const ambulances = [];
  let idCounter = 1;

  // Create ambulances for each hospital
  hospitals.forEach((hospital) => {
    for (let i = 0; i < perHospital; i++) {
      ambulances.push({
        id: `a${idCounter++}`,
        lat: hospital.lat,
        lng: hospital.lng,
        homeHospitalId: hospital.id,
        homeHospitalLat: hospital.lat,
        homeHospitalLng: hospital.lng,
        status: 'idle',
        phase: 'idle',
        idleStartTime: Date.now(),
        patrolAngle: Math.random() * Math.PI * 2,
      });
    }
  });

  // Create independent ambulances (distributed randomly)
  for (let i = 0; i < independent; i++) {
    const randomHospital =
      hospitals[Math.floor(Math.random() * hospitals.length)];
    ambulances.push({
      id: `a${idCounter++}`,
      lat: randomHospital.lat,
      lng: randomHospital.lng,
      homeHospitalId: randomHospital.id,
      homeHospitalLat: randomHospital.lat,
      homeHospitalLng: randomHospital.lng,
      status: 'idle',
      phase: 'idle',
      idleStartTime: Date.now(),
      patrolAngle: Math.random() * Math.PI * 2,
    });
  }

  return ambulances;
};
