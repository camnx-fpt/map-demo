import React from 'react';
import { useTranslation } from 'react-i18next';
import './FollowBanner.css';

const FollowBanner = ({ followTarget, onClear }) => {
  const { t } = useTranslation();

  if (!followTarget) return null;

  const getIcon = () => {
    switch (followTarget.type) {
      case 'ambulance':
        return '🚑';
      case 'discovery':
        return '📍';
      case 'hospital':
        return '🏥';
      default:
        return '🎯';
    }
  };

  return (
    <div className="follow-banner">
      <div className="follow-content">
        <span className="follow-icon">{getIcon()}</span>
        <span className="follow-text">
          <strong>{t('focus.title')}:</strong> {followTarget.name}
        </span>
      </div>
      <button className="follow-close" onClick={onClear} title="Stop following">
        ✕
      </button>
    </div>
  );
};

export default FollowBanner;
