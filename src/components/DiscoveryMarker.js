import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useTranslation } from 'react-i18next';
import { createDiscoveryIcon } from "./CustomIcons";

const DiscoveryMarker = ({ point, relatedRoute, onHover }) => {
  const { t } = useTranslation();
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
        mouseout: handleMouseOut,
      }}
    >
      <Popup>
        <div className="popup-content">
          <h3>📍 {point.name}</h3>
          <p>
            <strong>事故種別:</strong> {point.incidentType}
          </p>
          <p>
            <strong>発生時刻:</strong> {point.time}
          </p>
          <p>
            <strong>{t('filter.peopleCount')}</strong> {peopleCount}{t('filter.people')}
          </p>
          {relatedRoute && (
            <p>
              <strong>{t('priority.label')}</strong>{" "}
              <span className={`route-badge ${relatedRoute.priority}`}>
                {relatedRoute.priority === "critical" && t('priority.critical')}
                {relatedRoute.priority === "high" && t('priority.high')}
                {relatedRoute.priority === "medium" && t('priority.medium')}
                {relatedRoute.priority === "low" && t('priority.low')}
              </span>
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default DiscoveryMarker;
