import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createAmbulanceIcon } from './CustomIcons';

const AmbulanceMarker = ({ ambulance, relatedRoute, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
    if (relatedRoute && onHover) {
      onHover(relatedRoute.id, true);
    }
  };

  const handleMouseOut = () => {
    setIsHovered(false);
    if (relatedRoute && onHover) {
      onHover(relatedRoute.id, false);
    }
  };

  return (
    <Marker 
      position={[ambulance.lat, ambulance.lng]}
      icon={createAmbulanceIcon(isHovered)}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
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
};

export default AmbulanceMarker;
