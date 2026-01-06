// Mock data for hospitals in Japan (Tokyo and Hamamatsu area)
export const hospitals = [
  // Tokyo area hospitals
  {
    id: "h1",
    name: "東京大学医学部附属病院",
    name_en: "University of Tokyo Hospital",
    lat: 35.7146,
    lng: 139.7626,
    address: "東京都文京区本郷7-3-1",
  },
  {
    id: "h2",
    name: "慶應義塾大学病院",
    name_en: "Keio University Hospital",
    lat: 35.6503,
    lng: 139.7436,
    address: "東京都新宿区信濃町35",
  },
  {
    id: "h3",
    name: "聖路加国際病院",
    name_en: "St. Luke's International Hospital",
    lat: 35.6707,
    lng: 139.7747,
    address: "東京都中央区明石町9-1",
  },
  {
    id: "h4",
    name: "順天堂大学医学部附属順天堂医院",
    name_en: "Juntendo University Hospital",
    lat: 35.7026,
    lng: 139.762,
    address: "東京都文京区本郷3-1-3",
  },
  {
    id: "h5",
    name: "東京医科歯科大学病院",
    name_en: "Tokyo Medical and Dental University Hospital",
    lat: 35.7024,
    lng: 139.7638,
    address: "東京都文京区湯島1-5-45",
  },
  {
    id: "h6",
    name: "虎の門病院",
    name_en: "Toranomon Hospital",
    lat: 35.6659,
    lng: 139.7456,
    address: "東京都港区虎ノ門2-2-2",
  },
  // Hamamatsu area hospitals
  {
    id: "h7",
    name: "浜松医科大学医学部附属病院",
    name_en: "Hamamatsu University Hospital",
    lat: 34.7608,
    lng: 137.7278,
    address: "静岡県浜松市東区半田山1-20-1",
  },
  {
    id: "h8",
    name: "浜松医療センター",
    name_en: "Hamamatsu Medical Center",
    lat: 34.7108,
    lng: 137.735,
    address: "静岡県浜松市中区富塚町328",
  },
  {
    id: "h9",
    name: "聖隷浜松病院",
    name_en: "Seirei Hamamatsu Hospital",
    lat: 34.7458,
    lng: 137.7114,
    address: "静岡県浜松市中区住吉2-12-12",
  },
  {
    id: "h10",
    name: "浜松赤十字病院",
    name_en: "Hamamatsu Red Cross Hospital",
    lat: 34.728,
    lng: 137.7525,
    address: "静岡県浜松市浜北区小林1088-1",
  },
];

// Mock data for ambulances (positioned between discovery points and hospitals)
// Main hospital (h2 - Keio) receives 6 ambulances from all directions
// Secondary hospital (h3 - St. Luke's) receives 2 ambulances
export const ambulances = [
  // Ambulances heading to Keio Hospital (h2) - creating circle pattern
  {
    id: "a1",
    name: "救急車1号",
    vehicleNumber: "TO-01-1234",
    lat: 35.6515, // Offset position to avoid straight line
    lng: 139.718, // Shifted west from straight path
    status: "en_route",
  },
  {
    id: "a2",
    name: "救急車2号",
    vehicleNumber: "TO-01-5678",
    lat: 35.657, // Northeast of h2
    lng: 139.755,
    status: "en_route",
  },
  {
    id: "a3",
    name: "救急車3号",
    vehicleNumber: "TO-01-9012",
    lat: 35.6503, // East of h2
    lng: 139.758,
    status: "en_route",
  },
  {
    id: "a4",
    name: "救急車4号",
    vehicleNumber: "TO-01-3456",
    lat: 35.644, // Southeast of h2
    lng: 139.752,
    status: "en_route",
  },
  {
    id: "a5",
    name: "救急車5号",
    vehicleNumber: "TO-01-7890",
    lat: 35.647, // South of h2
    lng: 139.73,
    status: "en_route",
  },
  {
    id: "a6",
    name: "救急車6号",
    vehicleNumber: "TO-01-2468",
    lat: 35.655, // Northwest of h2
    lng: 139.735,
    status: "en_route",
  },
  // Ambulances heading to St. Luke's Hospital (h3) - fewer cases
  {
    id: "a7",
    name: "救急車7号",
    vehicleNumber: "TO-01-1357",
    lat: 35.673,
    lng: 139.765,
    status: "en_route",
  },
  {
    id: "a8",
    name: "救急車8号",
    vehicleNumber: "TO-01-2460",
    lat: 35.668,
    lng: 139.782,
    status: "en_route",
  },
];

// Mock data for discovery points (incident locations)
// 6 incidents heading to Keio Hospital (h2)
// 2 incidents heading to St. Luke's Hospital (h3)
export const discoveryPoints = [
  // Incidents for Keio Hospital (h2) - from all directions
  {
    id: "d1",
    name: "渋谷駅前",
    lat: 35.658,
    lng: 139.7016,
    incidentType: "交通事故",
    time: "2026-01-05 14:30",
    peopleCount: 12,
  },
  {
    id: "d2",
    name: "六本木交差点",
    lat: 35.664,
    lng: 139.765,
    incidentType: "心肺停止",
    time: "2026-01-05 14:35",
    peopleCount: 1,
  },
  {
    id: "d3",
    name: "表参道駅",
    lat: 35.6503,
    lng: 139.772,
    incidentType: "急病",
    time: "2026-01-05 14:40",
    peopleCount: 6,
  },
  {
    id: "d4",
    name: "青山一丁目",
    lat: 35.638,
    lng: 139.76,
    incidentType: "転倒",
    time: "2026-01-05 14:45",
    peopleCount: 2,
  },
  {
    id: "d5",
    name: "代々木公園",
    lat: 35.644,
    lng: 139.717,
    incidentType: "熱中症",
    time: "2026-01-05 14:50",
    peopleCount: 3,
  },
  {
    id: "d6",
    name: "新宿御苑前",
    lat: 35.66,
    lng: 139.726,
    incidentType: "意識不明",
    time: "2026-01-05 14:55",
    peopleCount: 8,
  },
  // Incidents for St. Luke's Hospital (h3) - fewer cases
  {
    id: "d7",
    name: "築地市場",
    lat: 35.675,
    lng: 139.755,
    incidentType: "打撲",
    time: "2026-01-05 15:00",
    peopleCount: 4,
  },
  {
    id: "d8",
    name: "銀座四丁目",
    lat: 35.682,
    lng: 139.772,
    incidentType: "脱水症状",
    time: "2026-01-05 15:05",
    peopleCount: 0,
  },
];

// Mock data for routes (connections between discovery point → ambulance → hospital)
// 6 routes to Keio Hospital (h2) - creating convergence pattern
// 2 routes to St. Luke's Hospital (h3)
export const routes = [
  // Routes to Keio Hospital (h2) - High priority hospital with many cases
  {
    id: "r1",
    discoveryPointId: "d1",
    ambulanceId: "a1",
    hospitalId: "h2",
    color: "#DC2626", // Red - High priority
    priority: "high",
  },
  {
    id: "r2",
    discoveryPointId: "d2",
    ambulanceId: "a2",
    hospitalId: "h2",
    color: "#EA580C", // Orange - Critical
    priority: "critical",
  },
  {
    id: "r3",
    discoveryPointId: "d3",
    ambulanceId: "a3",
    hospitalId: "h2",
    color: "#DC2626", // Red - High priority
    priority: "high",
  },
  {
    id: "r4",
    discoveryPointId: "d4",
    ambulanceId: "a4",
    hospitalId: "h2",
    color: "#0891B2", // Cyan - Medium priority
    priority: "medium",
  },
  {
    id: "r5",
    discoveryPointId: "d5",
    ambulanceId: "a5",
    hospitalId: "h2",
    color: "#EA580C", // Orange - Critical
    priority: "critical",
  },
  {
    id: "r6",
    discoveryPointId: "d6",
    ambulanceId: "a6",
    hospitalId: "h2",
    color: "#DC2626", // Red - High priority
    priority: "high",
  },
  // Routes to St. Luke's Hospital (h3) - Lower priority cases
  {
    id: "r7",
    discoveryPointId: "d7",
    ambulanceId: "a7",
    hospitalId: "h3",
    color: "#059669", // Green - Low priority
    priority: "low",
  },
  {
    id: "r8",
    discoveryPointId: "d8",
    ambulanceId: "a8",
    hospitalId: "h3",
    color: "#0891B2", // Cyan - Medium priority
    priority: "medium",
  },
];
