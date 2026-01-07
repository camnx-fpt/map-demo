import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { createHospitalIcon } from './CustomIcons';

const HospitalMarker = ({
  hospital,
  ambulanceCount,
  onHover,
  isFollowing = false,
  onFocus,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleFollowClick = () => {
    if (onFocus) {
      const name = hospital.name;
      onFocus(hospital.lat, hospital.lng, hospital.id, 'hospital', name);
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
    onHover && onHover(hospital.id, true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
    onHover && onHover(hospital.id, false);
  };

  return (
    <Marker
      position={[hospital.lat, hospital.lng]}
      icon={createHospitalIcon(
        ambulanceCount,
        isHovered || isFollowing,
        isFollowing
      )}
      zIndexOffset={isFollowing ? 1000 : 0}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
      }}
    >
      <Popup>
        <div className="popup-content">
          <h3>🏥 {hospital.name}</h3>
          <p>
            <strong>{hospital.name_en}</strong>
          </p>
          <p>{hospital.address}</p>
          {ambulanceCount > 0 && (
            <p>
              <strong>{t('status.enRoute')}</strong> {ambulanceCount}
              {t('status.vehicles')}
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

export default HospitalMarker;
