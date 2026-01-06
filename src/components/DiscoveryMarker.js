import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { createDiscoveryIcon } from './CustomIcons';

const DiscoveryMarker = ({ point, relatedRoute, onHover }) => {
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

  const peopleCount = point.peopleCount || 0;

  return (
    <Marker 
      position={[point.lat, point.lng]}
      icon={createDiscoveryIcon(peopleCount, isHovered)}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      }}
    >
      <Popup>
        <div className="popup-content">
          <h3>📍 {point.name}</h3>
          <p><strong>事故種別:</strong> {point.incidentType}</p>
          <p><strong>発生時刻:</strong> {point.time}</p>
          <p><strong>人数:</strong> {peopleCount}人</p>
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

export default DiscoveryMarker;
