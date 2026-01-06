/**
 * Application Constants
 */

// Map configuration
export const MAP_CONFIG = {
  center: [35.2, 138.5], // Tokyo-Hamamatsu corridor
  zoom: 8,
  minZoom: 6,
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Simulation settings defaults
export const SIMULATION_DEFAULTS = {
  ambulancesPerHospital: 2,
  independentAmbulances: 0,
  maxIncidents: 12,
  minIdleTime: 5, // seconds
  maxIdleTime: 15, // seconds
  moveSpeed: 0.0005,
  patrolRadius: 0.015,
  patrolMoveDistance: 0.0003,
};

// Incident types for random generation
export const INCIDENT_TYPES = [
  "交通事故",
  "心肺停止",
  "急病",
  "転倒",
  "熱中症",
  "意識不明",
  "打撲",
  "脱水症状",
];

// Location names for Tokyo area
export const TOKYO_AREAS = [
  "渋谷",
  "新宿",
  "六本木",
  "銀座",
  "池袋",
  "品川",
  "恵比寿",
  "表参道",
  "原宿",
  "代官山",
];

// Location names for Hamamatsu area
export const HAMAMATSU_AREAS = [
  "浜松",
  "舞阪",
  "浜北",
  "天竜",
  "細江",
  "引佐",
  "三ヶ日",
  "春野",
  "佐久間",
  "水窪",
];

// Location suffixes
export const LOCATION_SUFFIXES = ["駅前", "交差点", "公園", "広場", "通り"];

// Geographic boundaries
export const GEO_BOUNDS = {
  tokyo: {
    lat: { min: 35.6, max: 35.75 },
    lng: { min: 139.65, max: 139.8 },
  },
  hamamatsu: {
    lat: { min: 34.7, max: 34.8 },
    lng: { min: 137.7, max: 137.8 },
  },
};

// Probability settings
export const PROBABILITY = {
  tokyoArea: 0.6, // 60% Tokyo, 40% Hamamatsu
  incidentCreation: 0.3, // 30% chance per idle check
};

// Filter options
export const PEOPLE_COUNT_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "10+", label: "10+人" },
  { value: "5-9", label: "5-9人" },
  { value: "3-4", label: "3-4人" },
  { value: "2", label: "2人" },
  { value: "1", label: "1人" },
  { value: "0", label: "0人" },
];

// Route priorities
export const ROUTE_PRIORITIES = ["critical", "high", "medium", "low"];
