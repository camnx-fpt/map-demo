import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { createAmbulanceIcon } from './CustomIcons';

const AmbulanceMarker = ({
  ambulance,
  relatedRoute,
  onHover,
  markerRef,
  isFollowing,
  onFocus,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const localMarkerRef = useRef(null);

  const getStatusLabel = () => {
    if (ambulance.status === 'en_route') {
      if (ambulance.phase === 'to_discovery') {
        return t('focus.toDiscovery');
      } else if (ambulance.phase === 'at_discovery') {
        return t('focus.atDiscovery');
      } else if (ambulance.phase === 'to_hospital') {
        return t('focus.toHospital');
      }
    }
    return t('status.idle');
  };

  const handleFollowClick = () => {
    if (onFocus) {
      const name = `${t('focus.ambulance')} #${ambulance.id} - ${getStatusLabel()}`;
      onFocus(ambulance.lat, ambulance.lng, ambulance.id, 'ambulance', name);
    }
  };

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
      icon={createAmbulanceIcon(isHovered || isFollowing, isFollowing)}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}
      zIndexOffset={isFollowing ? 1000 : 0}
    >
      <Popup>
        <div className="popup-content">
          <h3>🚑 {ambulance.name}</h3>
          <p>
            <strong>車両番号:</strong> {ambulance.vehicleNumber}
          </p>
          <p>
            <strong>状態:</strong>{' '}
            {ambulance.status === 'en_route'
              ? t('status.enRoute')
              : t('status.idle')}
          </p>
          {relatedRoute && (
            <p>
              <strong>{t('priority.label')}</strong>{' '}
              <span className={`route-badge ${relatedRoute.priority}`}>
                {relatedRoute.priority === 'critical' && t('priority.critical')}
                {relatedRoute.priority === 'high' && t('priority.high')}
                {relatedRoute.priority === 'medium' && t('priority.medium')}
                {relatedRoute.priority === 'low' && t('priority.low')}
              </span>
            </p>
          )}
          <button
            className="popup-follow-btn"
            onClick={handleFollowClick}
            disabled={isFollowing}
          >
            {isFollowing ? '✔️ Following' : '🎯 Follow'}
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default AmbulanceMarker;
