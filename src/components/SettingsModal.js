/**
 * Settings Modal Component
 * Configuration panel for simulation parameters with localStorage persistence
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SIMULATION_DEFAULTS } from '../config/constants';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const { t } = useTranslation();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: parseInt(value) || 0,
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(SIMULATION_DEFAULTS);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('settings.title')}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-grid">
            {/* Ambulances per Hospital */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">
                  {t('settings.ambulancesPerHospital')}
                </span>
                <span className="setting-description">
                  {t('settings.ambulancesPerHospitalDesc')}
                </span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={localSettings.ambulancesPerHospital}
                  onChange={(e) =>
                    handleChange('ambulancesPerHospital', e.target.value)
                  }
                  className="setting-input"
                />
                <span className="setting-unit">{t('units.vehicles')}</span>
              </div>
            </div>

            {/* Independent Ambulances */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">
                  {t('settings.independentAmbulances')}
                </span>
                <span className="setting-description">
                  {t('settings.independentAmbulancesDesc')}
                </span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={localSettings.independentAmbulances}
                  onChange={(e) =>
                    handleChange('independentAmbulances', e.target.value)
                  }
                  className="setting-input"
                />
                <span className="setting-unit">{t('units.vehicles')}</span>
              </div>
            </div>

            {/* Max Incidents */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">
                  {t('settings.maxIncidents')}
                </span>
                <span className="setting-description">
                  {t('settings.maxIncidentsDesc')}
                </span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={localSettings.maxIncidents}
                  onChange={(e) => handleChange('maxIncidents', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-unit">{t('units.incidents')}</span>
              </div>
            </div>

            {/* Min Idle Time */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">
                  {t('settings.minWaitTime')}
                </span>
                <span className="setting-description">
                  {t('settings.minWaitTimeDesc')}
                </span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={localSettings.minIdleTime}
                  onChange={(e) => handleChange('minIdleTime', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-unit">{t('units.seconds')}</span>
              </div>
            </div>

            {/* Max Idle Time */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">
                  {t('settings.maxWaitTime')}
                </span>
                <span className="setting-description">
                  {t('settings.maxWaitTimeDesc')}
                </span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={localSettings.maxIdleTime}
                  onChange={(e) => handleChange('maxIdleTime', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-unit">{t('units.seconds')}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="setting-summary">
              <div className="summary-item">
                <span className="summary-label">{t('stats.total')}:</span>
                <span className="summary-value">
                  {localSettings.ambulancesPerHospital * 10 +
                    localSettings.independentAmbulances}{' '}
                  {t('units.vehicles')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  {t('settings.incidentInterval')}:
                </span>
                <span className="summary-value">
                  {localSettings.minIdleTime}〜{localSettings.maxIdleTime}
                  {t('units.seconds')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleReset}>
            {t('settings.resetToDefault')}
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              {t('settings.cancel')}
            </button>
            <button className="btn-primary" onClick={handleSave}>
              {t('settings.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
