/**
 * Settings Modal Component
 * Configuration panel for simulation parameters with localStorage persistence
 */

import React, { useState, useEffect } from 'react';
import { SIMULATION_DEFAULTS } from '../config/constants';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: parseInt(value) || 0
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
          <h2>シミュレーション設定</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="settings-grid">
            {/* Ambulances per Hospital */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">病院ごとの救急車数</span>
                <span className="setting-description">各病院に配置される救急車の台数</span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={localSettings.ambulancesPerHospital}
                  onChange={(e) => handleChange('ambulancesPerHospital', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-unit">台</span>
              </div>
            </div>

            {/* Independent Ambulances */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">独立救急車数</span>
                <span className="setting-description">病院に所属しない独立した救急車</span>
              </label>
              <div className="setting-input-group">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={localSettings.independentAmbulances}
                  onChange={(e) => handleChange('independentAmbulances', e.target.value)}
                  className="setting-input"
                />
                <span className="setting-unit">台</span>
              </div>
            </div>

            {/* Max Incidents */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">最大同時事故数</span>
                <span className="setting-description">同時に発生可能な事故の上限</span>
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
                <span className="setting-unit">件</span>
              </div>
            </div>

            {/* Min Idle Time */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">待機時間（最小）</span>
                <span className="setting-description">事故発生までの最小待機時間</span>
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
                <span className="setting-unit">秒</span>
              </div>
            </div>

            {/* Max Idle Time */}
            <div className="setting-row">
              <label className="setting-label">
                <span className="setting-title">待機時間（最大）</span>
                <span className="setting-description">事故発生までの最大待機時間</span>
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
                <span className="setting-unit">秒</span>
              </div>
            </div>

            {/* Summary */}
            <div className="setting-summary">
              <div className="summary-item">
                <span className="summary-label">総救急車数:</span>
                <span className="summary-value">
                  {localSettings.ambulancesPerHospital * 10 + localSettings.independentAmbulances}台
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">事故発生間隔:</span>
                <span className="summary-value">
                  {localSettings.minIdleTime}〜{localSettings.maxIdleTime}秒
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleReset}>
            デフォルトに戻す
          </button>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              キャンセル
            </button>
            <button className="btn-primary" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
