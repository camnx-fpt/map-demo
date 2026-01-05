import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import { hospitals, ambulances, discoveryPoints, routes } from './data/mockData';

const { BaseLayer } = LayersControl;

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const ambulanceIcon = new L.Icon({
  iconUrl: '/assets/ic-circle-ambulance.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: 'ambulance-marker'
});

const discoveryIcon = new L.Icon({
  iconUrl: '/assets/ic-circle-discovery.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: 'discovery-marker'
});

function App() {
  const [filters, setFilters] = useState({
    hospitals: true,
    ambulances: true,
    discoveryPoints: true,
    routes: true
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRoutes, setHoveredRoutes] = useState([]);
  const [hoveredHospital, setHoveredHospital] = useState(null);

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filterData = (data, type) => {
    if (!searchTerm) return data;
    
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      if (type === 'hospital') {
        return item.name.toLowerCase().includes(lowerSearch) || 
               item.name_en.toLowerCase().includes(lowerSearch);
      } else if (type === 'ambulance') {
        return item.name.toLowerCase().includes(lowerSearch) || 
               item.vehicleNumber.toLowerCase().includes(lowerSearch);
      }
      return true;
    });
  };

  const getRouteCoordinates = (route) => {
    const discovery = discoveryPoints.find(d => d.id === route.discoveryPointId);
    const ambulance = ambulances.find(a => a.id === route.ambulanceId);
    const hospital = hospitals.find(h => h.id === route.hospitalId);

    if (!discovery || !ambulance || !hospital) return null;

    return {
      segment1: [
        [discovery.lat, discovery.lng],
        [ambulance.lat, ambulance.lng]
      ],
      segment2: [
        [ambulance.lat, ambulance.lng],
        [hospital.lat, hospital.lng]
      ]
    };
  };

  const handleRouteHover = (routeId, isHovering) => {
    if (isHovering) {
      setHoveredRoutes(prev => [...prev, routeId]);
    } else {
      setHoveredRoutes(prev => prev.filter(id => id !== routeId));
    }
  };

  const handleHospitalHover = (hospitalId, isHovering) => {
    setHoveredHospital(isHovering ? hospitalId : null);
  };

  // Create hospital icon with badge
  const createHospitalIconWithBadge = (count) => {
    return new L.DivIcon({
      className: 'custom-hospital-marker',
      html: `
        <div class="marker-container">
          <img src="/assets/ic-circle-hospital.svg" alt="Hospital" class="hospital-marker" />
          ${count > 0 ? `<span class="marker-badge">${count}</span>` : ''}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  const filteredHospitals = filterData(hospitals, 'hospital');
  const filteredAmbulances = filterData(ambulances, 'ambulance');

  return (
    <div className="App">
      <div className="sidebar">
        <h2>日本病院マップ</h2>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="病院または救急車を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <h3>レイヤー</h3>
          <label>
            <input
              type="checkbox"
              checked={filters.hospitals}
              onChange={() => handleFilterChange('hospitals')}
            />
            <span>🏥 病院</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.ambulances}
              onChange={() => handleFilterChange('ambulances')}
            />
            <span>🚑 救急車</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.discoveryPoints}
              onChange={() => handleFilterChange('discoveryPoints')}
            />
            <span>📍 発見地点</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.routes}
              onChange={() => handleFilterChange('routes')}
            />
            <span>🔗 ルート</span>
          </label>
        </div>

        <div className="info">
          <h3>統計</h3>
          <p>🏥 病院: {filteredHospitals.length}</p>
          <p>🚑 救急車: {filteredAmbulances.length}</p>
          <p>📍 発見地点: {discoveryPoints.length}</p>
        </div>

        <div className="legend">
          <h3>ルート優先度</h3>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#EA580C' }}></div>
            <span>緊急</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#DC2626' }}></div>
            <span>高</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#0891B2' }}></div>
            <span>中</span>
          </div>
          <div className="legend-item">
            <div className="legend-line" style={{ background: '#059669' }}></div>
            <span>低</span>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[35.6762, 139.6503]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <LayersControl position="topright">
            <BaseLayer name="🗾 淡色地図 (Pale)">
              <TileLayer
                attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            
            <BaseLayer name="🗾 標準地図 (Standard)">
              <TileLayer
                attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            
            <BaseLayer name="🗾 色別標高図 (Relief Map)">
              <TileLayer
                attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            
            <BaseLayer checked name="📷 写真 (Satellite)">
              <TileLayer
                attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
                url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
              />
            </BaseLayer>
            
            <BaseLayer name="🌍 OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </BaseLayer>
            
            {/* Dark theme */}
            <BaseLayer name="🌙 Dark Mode">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </BaseLayer>
          </LayersControl>

          {/* Hospital markers */}
          {filters.hospitals && filteredHospitals.map(hospital => {
            const relatedRoutes = routes.filter(r => r.hospitalId === hospital.id);
            const ambulanceCount = relatedRoutes.length;
            
            return (
              <Marker 
                key={hospital.id} 
                position={[hospital.lat, hospital.lng]}
                icon={createHospitalIconWithBadge(ambulanceCount)}
                eventHandlers={{
                  mouseover: () => handleHospitalHover(hospital.id, true),
                  mouseout: () => handleHospitalHover(hospital.id, false)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>🏥 {hospital.name}</h3>
                    <p><strong>{hospital.name_en}</strong></p>
                    <p>{hospital.address}</p>
                    {ambulanceCount > 0 && (
                      <p><strong>搬送中:</strong> {ambulanceCount}台</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Ambulance markers */}
          {filters.ambulances && filteredAmbulances.map(ambulance => {
            const relatedRoute = routes.find(r => r.ambulanceId === ambulance.id);
            return (
              <Marker 
                key={ambulance.id} 
                position={[ambulance.lat, ambulance.lng]}
                icon={ambulanceIcon}
                eventHandlers={{
                  mouseover: () => relatedRoute && handleRouteHover(relatedRoute.id, true),
                  mouseout: () => relatedRoute && handleRouteHover(relatedRoute.id, false)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>🚑 {ambulance.name}</h3>
                    <p><strong>車両番号:</strong> {ambulance.vehicleNumber}</p>
                    <p><strong>状態:</strong> {ambulance.status === 'en_route' ? '搬送中' : '待機中'}</p>
                    {relatedRoute && (
                      <p>
                        <strong>優先度:</strong>{' '}
                        <span className={`route-badge ${relatedRoute.priority}`}>
                          {relatedRoute.priority === 'critical' && '緊急'}
                          {relatedRoute.priority === 'high' && '高'}
                          {relatedRoute.priority === 'medium' && '中'}
                          {relatedRoute.priority === 'low' && '低'}
                        </span>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Discovery point markers */}
          {filters.discoveryPoints && discoveryPoints.map(point => {
            const relatedRoute = routes.find(r => r.discoveryPointId === point.id);
            return (
              <Marker 
                key={point.id} 
                position={[point.lat, point.lng]}
                icon={discoveryIcon}
                eventHandlers={{
                  mouseover: () => relatedRoute && handleRouteHover(relatedRoute.id, true),
                  mouseout: () => relatedRoute && handleRouteHover(relatedRoute.id, false)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>📍 {point.name}</h3>
                    <p><strong>事故種別:</strong> {point.incidentType}</p>
                    <p><strong>発生時刻:</strong> {point.time}</p>
                    {relatedRoute && (
                      <p>
                        <strong>優先度:</strong>{' '}
                        <span className={`route-badge ${relatedRoute.priority}`}>
                          {relatedRoute.priority === 'critical' && '緊急'}
                          {relatedRoute.priority === 'high' && '高'}
                          {relatedRoute.priority === 'medium' && '中'}
                          {relatedRoute.priority === 'low' && '低'}
                        </span>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Route polylines */}
          {filters.routes && routes.map(route => {
            const coordinates = getRouteCoordinates(route);
            if (!coordinates) return null;
            
            const isHoveredDirectly = hoveredRoutes.includes(route.id);
            const isHoveredViaHospital = hoveredHospital === route.hospitalId;
            const isHovered = isHoveredDirectly || isHoveredViaHospital;

            return (
              <React.Fragment key={route.id}>
                {/* Segment 1: Discovery Point -> Ambulance */}
                <Polyline
                  key={`${route.id}-seg1-${isHovered}`}
                  positions={coordinates.segment1}
                  color={route.color}
                  weight={isHovered ? 6 : 3}
                  opacity={isHovered ? 1 : 0.7}
                  eventHandlers={{
                    mouseover: () => handleRouteHover(route.id, true),
                    mouseout: () => handleRouteHover(route.id, false)
                  }}
                />
                {/* Segment 2: Ambulance -> Hospital */}
                <Polyline
                  key={`${route.id}-seg2-${isHovered}`}
                  positions={coordinates.segment2}
                  color={route.color}
                  weight={isHovered ? 6 : 3}
                  opacity={isHovered ? 1 : 0.7}
                  eventHandlers={{
                    mouseover: () => handleRouteHover(route.id, true),
                    mouseout: () => handleRouteHover(route.id, false)
                  }}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
