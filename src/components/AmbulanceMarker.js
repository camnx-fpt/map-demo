import React, { useState, useRef, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { useTranslation } from 'react-i18next';
import { createAmbulanceIcon } from "./CustomIcons";

const AmbulanceMarker = ({ ambulance, relatedRoute, onHover, markerRef }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const localMarkerRef = useRef(null);

  useEffect(() => {
    if (markerRef && localMarkerRef.current) {
      markerRef(localMarkerRef.current);
    }
    return () => {
      if (markerRef) {
        markerRef(null);
      }
    };
  }, [markerRef]);

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
      ref={localMarkerRef}
      position={[ambulance.lat, ambulance.lng]}
      icon={createAmbulanceIcon(isHovered)}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}
    >
      <Popup>
        <div className="popup-content">
          <h3>🚑 {ambulance.name}</h3>
          <p>
            <strong>車両番号:</strong> {ambulance.vehicleNumber}
          </p>
          <p>
            <strong>状態:</strong>{" "}
            {ambulance.status === "en_route" ? t('status.enRoute') : t('status.idle')}
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

export default AmbulanceMarker;
