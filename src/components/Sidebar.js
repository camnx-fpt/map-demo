import React from "react";
import { useTranslation } from 'react-i18next';

const Sidebar = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  peopleCountFilter,
  onPeopleCountChange,
  showOnlyEnRoute,
  onEnRouteChange,
  showOnlyIdle,
  onIdleChange,
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onSpeedChange,
  onReset,
  onOpenSettings,
  stats,
}) => {
  const { t } = useTranslation();
  
  const peopleCountOptions = [
    { value: "all", label: t('filter.all') },
    { value: "10+", label: "10+" },
    { value: "5-9", label: "5~9" },
    { value: "3-4", label: "3~4" },
    { value: "2", label: "2" },
    { value: "1", label: "1" },
    { value: "0", label: "0" },
  ];

  const speedOptions = [
    { value: 1, label: "1x" },
    { value: 2, label: "2x" },
    { value: 3, label: "3x" },
  ];
  return (
    <>
      <h2>{t('app.title')}</h2>

      {/* Simulation Control */}
      <div className="simulation-control">
        <button
          className={`simulation-button ${isSimulating ? "stop" : "start"}`}
          onClick={onToggleSimulation}
        >
          {isSimulating ? `⏸️ ${t('simulation.stop')}` : `▶️ ${t('simulation.start')}`}
        </button>

        <div className="control-row">
          <button
            className="reset-button"
            onClick={onReset}
            disabled={isSimulating}
          >
            🔄 {t('simulation.reset')}
          </button>
          <button
            className="settings-button"
            onClick={onOpenSettings}
            disabled={isSimulating}
          >
            ⚙️ {t('simulation.settings')}
          </button>
        </div>

        {isSimulating && (
          <div className="speed-control">
            <span className="speed-label">{t('simulation.speed')}:</span>
            <div className="speed-buttons">
              {speedOptions.map((option) => (
                <button
                  key={option.value}
                  className={`speed-button ${simulationSpeed === option.value ? "active" : ""}`}
                  onClick={() => onSpeedChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filters">
        <h3>{t('layers.title')}</h3>
        <label>
          <input
            type="checkbox"
            checked={filters.hospitals}
            onChange={() => onFilterChange("hospitals")}
          />
          <span>🏥 {t('layers.hospitals')}</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.ambulances}
            onChange={() => onFilterChange("ambulances")}
          />
          <span>🚑 {t('layers.ambulances')}</span>
        </label>
        <label className="indent">
          <input
            type="checkbox"
            checked={showOnlyEnRoute}
            onChange={(e) => onEnRouteChange(e.target.checked)}
            disabled={!filters.ambulances || showOnlyIdle}
          />
          <span>{t('layers.enRouteOnly')}</span>
        </label>
        <label className="indent">
          <input
            type="checkbox"
            checked={showOnlyIdle}
            onChange={(e) => onIdleChange(e.target.checked)}
            disabled={!filters.ambulances || showOnlyEnRoute}
          />
          <span>{t('layers.idleOnly')}</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.discoveryPoints}
            onChange={() => onFilterChange("discoveryPoints")}
          />
          <span>📍 {t('layers.discoveryPoints')}</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.routes}
            onChange={() => onFilterChange("routes")}
          />
          <span>🔗 {t('layers.routes')}</span>
        </label>
      </div>

      <div className="people-count-filter">
        <h3>{t('filter.peopleCount')}</h3>
        <div className="button-group">
          {peopleCountOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-button ${peopleCountFilter === option.value ? "active" : ""}`}
              onClick={() => onPeopleCountChange(option.value)}
              disabled={!filters.discoveryPoints}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="info">
        <h3>{t('stats.title')}</h3>
        <p>🏥 {t('stats.hospitals')}: {stats.hospitals}</p>
        <p>🚑 {t('stats.ambulances')}: {stats.ambulances}</p>
        <p>📍 {t('stats.discoveryPoints')}: {stats.discoveryPoints}</p>
        <p>🛣️ {t('stats.activeRoutes')}: {stats.activeRoutes}</p>
      </div>

      <div className="legend">
        <h3>{t('priority.title')}</h3>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#EA580C" }}></div>
          <span>{t('priority.critical')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#DC2626" }}></div>
          <span>{t('priority.high')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#0891B2" }}></div>
          <span>{t('priority.medium')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-line" style={{ background: "#059669" }}></div>
          <span>{t('priority.low')}</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
