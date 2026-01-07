import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FocusDropdown.css';

const FocusDropdown = ({
  ambulances,
  discoveryPoints,
  hospitals,
  onFocus,
  onView,
  followTarget,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('ambulances');

  const isFollowing = (id, type) => {
    return followTarget && followTarget.id === id && followTarget.type === type;
  };

  const getAmbulanceLabel = (ambulance) => {
    let status = t('status.idle');
    if (ambulance.status === 'en_route') {
      if (ambulance.phase === 'to_discovery') {
        status = t('focus.toDiscovery');
      } else if (ambulance.phase === 'at_discovery') {
        status = t('focus.atDiscovery');
      } else if (ambulance.phase === 'to_hospital') {
        status = t('focus.toHospital');
      }
    }
    return `${t('focus.ambulance')} #${ambulance.id} - ${status}`;
  };

  const getDiscoveryLabel = (discovery) => {
    return `${t('focus.discovery')} #${discovery.id} - ${discovery.peopleCount} ${t('filter.people')}`;
  };

  const getHospitalLabel = (hospital) => {
    return `${hospital.name}`;
  };

  const handleFollow = (item, type, event) => {
    event.stopPropagation();
    let name = '';
    if (type === 'ambulance') {
      name = getAmbulanceLabel(item);
    } else if (type === 'discovery') {
      name = getDiscoveryLabel(item);
    } else if (type === 'hospital') {
      name = getHospitalLabel(item);
    }
    onFocus(item.lat, item.lng, item.id, type, name);
    setIsOpen(false);
  };

  const handleView = (item, type, event) => {
    event.stopPropagation();
    onView(item.lat, item.lng, item.id, type);
    setIsOpen(false);
  };

  const renderItems = () => {
    switch (selectedType) {
      case 'ambulances':
        return ambulances.map((ambulance) => (
          <div
            key={ambulance.id}
            className={`focus-item ${isFollowing(ambulance.id, 'ambulance') ? 'active-follow' : ''}`}
          >
            <div className="focus-info">
              <span className="focus-icon">🚑</span>
              <span className="focus-label">
                {getAmbulanceLabel(ambulance)}
              </span>
            </div>
            <div className="focus-actions">
              <button
                className="focus-action-btn follow-btn"
                onClick={(e) => handleFollow(ambulance, 'ambulance', e)}
                title="Follow this ambulance"
              >
                🎯 Follow
              </button>
              <button
                className="focus-action-btn view-btn"
                onClick={(e) => handleView(ambulance, 'ambulance', e)}
                title="View this ambulance"
              >
                👁️ View
              </button>
            </div>
          </div>
        ));
      case 'discoveryPoints':
        return discoveryPoints.map((discovery) => (
          <div
            key={discovery.id}
            className={`focus-item ${isFollowing(discovery.id, 'discovery') ? 'active-follow' : ''}`}
          >
            <div className="focus-info">
              <span className="focus-icon">📍</span>
              <span className="focus-label">
                {getDiscoveryLabel(discovery)}
              </span>
            </div>
            <div className="focus-actions">
              <button
                className="focus-action-btn follow-btn"
                onClick={(e) => handleFollow(discovery, 'discovery', e)}
                title="Follow this point"
              >
                🎯 Follow
              </button>
              <button
                className="focus-action-btn view-btn"
                onClick={(e) => handleView(discovery, 'discovery', e)}
                title="View this point"
              >
                👁️ View
              </button>
            </div>
          </div>
        ));
      case 'hospitals':
        return hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`focus-item ${isFollowing(hospital.id, 'hospital') ? 'active-follow' : ''}`}
          >
            <div className="focus-info">
              <span className="focus-icon">🏥</span>
              <span className="focus-label">{getHospitalLabel(hospital)}</span>
            </div>
            <div className="focus-actions">
              <button
                className="focus-action-btn follow-btn"
                onClick={(e) => handleFollow(hospital, 'hospital', e)}
                title="Follow this hospital"
              >
                🎯 Follow
              </button>
              <button
                className="focus-action-btn view-btn"
                onClick={(e) => handleView(hospital, 'hospital', e)}
                title="View this hospital"
              >
                👁️ View
              </button>
            </div>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="focus-dropdown">
      <button className="focus-button" onClick={() => setIsOpen(!isOpen)}>
        🎯 {t('focus.title')}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="focus-menu">
          <div className="focus-tabs">
            <button
              className={`focus-tab ${selectedType === 'ambulances' ? 'active' : ''}`}
              onClick={() => setSelectedType('ambulances')}
            >
              🚑 {t('layers.ambulances')} ({ambulances.length})
            </button>
            <button
              className={`focus-tab ${selectedType === 'discoveryPoints' ? 'active' : ''}`}
              onClick={() => setSelectedType('discoveryPoints')}
            >
              📍 {t('layers.discoveryPoints')} ({discoveryPoints.length})
            </button>
            <button
              className={`focus-tab ${selectedType === 'hospitals' ? 'active' : ''}`}
              onClick={() => setSelectedType('hospitals')}
            >
              🏥 {t('layers.hospitals')} ({hospitals.length})
            </button>
          </div>

          <div className="focus-items">
            {renderItems().length > 0 ? (
              renderItems()
            ) : (
              <div className="focus-empty">{t('focus.selectItem')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusDropdown;
