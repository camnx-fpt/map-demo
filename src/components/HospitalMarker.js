import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { useTranslation } from 'react-i18next';
import { createHospitalIcon } from "./CustomIcons";

const HospitalMarker = ({ hospital, ambulanceCount, onHover }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

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
      icon={createHospitalIcon(ambulanceCount, isHovered)}
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
              <strong>{t('status.enRoute')}</strong> {ambulanceCount}{t('status.vehicles')}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default HospitalMarker;
