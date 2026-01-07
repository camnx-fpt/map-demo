/**
 * ListPanel Component
 * Displays ambulances and hospitals in a table format with Focus/View actions
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ListPanel.css';

const ListPanel = ({
  ambulances = [],
  hospitals = [],
  onFocus,
  onView,
  followTarget,
  dynamicRoutes = [],
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ambulances');

  const isFollowing = (id, type) => {
    return followTarget && followTarget.id === id && followTarget.type === type;
  };

  const getStatusLabel = (ambulance) => {
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

  const getAmbulanceCount = (hospitalId) => {
    return dynamicRoutes.filter((r) => r.hospitalId === hospitalId).length;
  };

  // Mobile card renderers
  const renderAmbulanceCard = (ambulance) => {
    const status = getStatusLabel(ambulance);
    const name = `${t('focus.ambulance')} #${ambulance.id}`;
    const following = isFollowing(ambulance.id, 'ambulance');

    return (
      <div
        key={ambulance.id}
        className={`mobile-card ${following ? 'following' : ''}`}
      >
        <div className="mobile-card-header">
          <svg
            className="mobile-card-icon icon-ambulance"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <path d="M16 8h5l3 3v5h-8V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <div className="mobile-card-title">
            <div className="mobile-card-name">{name}</div>
            <div className="mobile-card-subtitle">
              {ambulance.vehicleNumber}
            </div>
          </div>
        </div>
        <div className="mobile-card-body">
          <div className="mobile-card-row">
            <span className="mobile-card-label">{t('status.label')}</span>
            <span className={`status-badge ${ambulance.status}`}>{status}</span>
          </div>
          {ambulance.priority && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">{t('priority.label')}</span>
              <span className={`priority-badge ${ambulance.priority}`}>
                {ambulance.priority === 'critical' && t('priority.critical')}
                {ambulance.priority === 'high' && t('priority.high')}
                {ambulance.priority === 'medium' && t('priority.medium')}
                {ambulance.priority === 'low' && t('priority.low')}
              </span>
            </div>
          )}
        </div>
        <div className="mobile-card-actions">
          <button
            className={`action-btn focus-btn ${following ? 'active' : ''}`}
            onClick={() =>
              onFocus(
                ambulance.lat,
                ambulance.lng,
                ambulance.id,
                'ambulance',
                name
              )
            }
            disabled={following}
          >
            {following ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Following
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Follow
              </>
            )}
          </button>
          <button
            className="action-btn view-btn"
            onClick={() =>
              onView(ambulance.lat, ambulance.lng, ambulance.id, 'ambulance')
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View
          </button>
        </div>
      </div>
    );
  };

  const renderHospitalCard = (hospital) => {
    const ambulanceCount = getAmbulanceCount(hospital.id);
    const following = isFollowing(hospital.id, 'hospital');

    return (
      <div
        key={hospital.id}
        className={`mobile-card ${following ? 'following' : ''}`}
      >
        <div className="mobile-card-header">
          <svg
            className="mobile-card-icon icon-hospital"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <div className="mobile-card-title">
            <div className="mobile-card-name">{hospital.name}</div>
            <div className="mobile-card-subtitle">{hospital.name_en}</div>
          </div>
        </div>
        <div className="mobile-card-body">
          <div className="mobile-card-row">
            <span className="mobile-card-label">{t('status.address')}</span>
            <span
              className="mobile-card-value"
              style={{ fontSize: '11px', textAlign: 'right' }}
            >
              {hospital.address}
            </span>
          </div>
          {ambulanceCount > 0 && (
            <div className="mobile-card-row">
              <span className="mobile-card-label">
                {t('stats.activeRoutes')}
              </span>
              <span className="ambulance-count">{ambulanceCount}</span>
            </div>
          )}
        </div>
        <div className="mobile-card-actions">
          <button
            className={`action-btn focus-btn ${following ? 'active' : ''}`}
            onClick={() =>
              onFocus(
                hospital.lat,
                hospital.lng,
                hospital.id,
                'hospital',
                hospital.name
              )
            }
            disabled={following}
          >
            {following ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Following
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Follow
              </>
            )}
          </button>
          <button
            className="action-btn view-btn"
            onClick={() =>
              onView(hospital.lat, hospital.lng, hospital.id, 'hospital')
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View
          </button>
        </div>
      </div>
    );
  };

  const renderAmbulanceRow = (ambulance) => {
    const status = getStatusLabel(ambulance);
    const name = `${t('focus.ambulance')} #${ambulance.id}`;
    const following = isFollowing(ambulance.id, 'ambulance');

    return (
      <tr key={ambulance.id} className={following ? 'following-row' : ''}>
        <td>
          <div className="table-cell-content">
            <svg
              className="icon-ambulance"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h5l3 3v5h-8V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="vehicle-name">{name}</span>
          </div>
        </td>
        <td>
          <span className={`status-badge ${ambulance.status}`}>{status}</span>
        </td>
        <td>
          <span className="vehicle-number">{ambulance.vehicleNumber}</span>
        </td>
        <td>
          {ambulance.priority && (
            <span className={`priority-badge ${ambulance.priority}`}>
              {ambulance.priority === 'critical' && t('priority.critical')}
              {ambulance.priority === 'high' && t('priority.high')}
              {ambulance.priority === 'medium' && t('priority.medium')}
              {ambulance.priority === 'low' && t('priority.low')}
            </span>
          )}
        </td>
        <td>
          <div className="action-buttons">
            <button
              className={`action-btn focus-btn ${following ? 'active' : ''}`}
              onClick={() =>
                onFocus(
                  ambulance.lat,
                  ambulance.lng,
                  ambulance.id,
                  'ambulance',
                  name
                )
              }
              disabled={following}
            >
              {following ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Follow
                </>
              )}
            </button>
            <button
              className="action-btn view-btn"
              onClick={() =>
                onView(ambulance.lat, ambulance.lng, ambulance.id, 'ambulance')
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderHospitalRow = (hospital) => {
    const ambulanceCount = getAmbulanceCount(hospital.id);
    const following = isFollowing(hospital.id, 'hospital');

    return (
      <tr key={hospital.id} className={following ? 'following-row' : ''}>
        <td>
          <div className="table-cell-content">
            <svg
              className="icon-hospital"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="hospital-name">{hospital.name}</span>
          </div>
        </td>
        <td>{hospital.name_en}</td>
        <td>{hospital.address}</td>
        <td>
          <span className="ambulance-count">
            {ambulanceCount > 0 ? `${ambulanceCount} 🚑` : '-'}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button
              className={`action-btn focus-btn ${following ? 'active' : ''}`}
              onClick={() =>
                onFocus(
                  hospital.lat,
                  hospital.lng,
                  hospital.id,
                  'hospital',
                  hospital.name
                )
              }
              disabled={following}
            >
              {following ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Follow
                </>
              )}
            </button>
            <button
              className="action-btn view-btn"
              onClick={() =>
                onView(hospital.lat, hospital.lng, hospital.id, 'hospital')
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="list-panel">
      <div className="list-panel-header">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'ambulances' ? 'active' : ''}`}
            onClick={() => setActiveTab('ambulances')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <path d="M16 8h5l3 3v5h-8V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {t('filter.ambulances')} ({ambulances.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'hospitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('hospitals')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            {t('filter.hospitals')} ({hospitals.length})
          </button>
        </div>
      </div>

      <div className="list-panel-content">
        {activeTab === 'ambulances' && (
          <>
            {/* Desktop/Tablet Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('focus.ambulance')}</th>
                    <th>{t('status.label')}</th>
                    <th>{t('status.vehicleNumber')}</th>
                    <th>{t('priority.label')}</th>
                    <th>{t('focus.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulances.length > 0 ? (
                    ambulances.map(renderAmbulanceRow)
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        {t('focus.noAmbulances')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="mobile-card-list">
              {ambulances.length > 0 ? (
                ambulances.map(renderAmbulanceCard)
              ) : (
                <div
                  className="no-data"
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#64748b',
                  }}
                >
                  {t('focus.noAmbulances')}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'hospitals' && (
          <>
            {/* Desktop/Tablet Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('filter.hospitals')}</th>
                    <th>{t('status.englishName')}</th>
                    <th>{t('status.address')}</th>
                    <th>{t('stats.activeRoutes')}</th>
                    <th>{t('focus.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.length > 0 ? (
                    hospitals.map(renderHospitalRow)
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        {t('focus.noHospitals')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="mobile-card-list">
              {hospitals.length > 0 ? (
                hospitals.map(renderHospitalCard)
              ) : (
                <div
                  className="no-data"
                  style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#64748b',
                  }}
                >
                  {t('focus.noHospitals')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListPanel;
