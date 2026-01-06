import React, { useState, useRef, useEffect } from 'react';

const MobileSidebar = ({ 
  isOpen,
  onClose,
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
  stats
}) => {
  const peopleCountOptions = [
    { value: 'all', label: 'すべて' },
    { value: '10+', label: '10+' },
    { value: '5-9', label: '5~9' },
    { value: '3-4', label: '3~4' },
    { value: '2', label: '2' },
    { value: '1', label: '1' },
    { value: '0', label: '0' }
  ];
  
  const speedOptions = [
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' }
  ];

  // Swipe to close gesture
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const headerRef = useRef(null);

  const handleTouchStart = (e) => {
    // Only track if touch starts on header area
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const newY = e.touches[0].clientY;
    const deltaY = newY - startY;
    
    // Only prevent default if dragging down (closing gesture)
    if (deltaY > 0) {
      e.preventDefault();
    }
    
    setCurrentY(newY);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    
    const deltaY = currentY - startY;
    
    // If swiped down more than 100px, close
    if (deltaY > 100) {
      onClose();
    }
    
    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="mobile-backdrop" onClick={onClose} />
      
      {/* Bottom Sheet */}
      <div 
        className="mobile-sidebar"
        style={{
          transform: isDragging && currentY > startY 
            ? `translateY(${currentY - startY}px)` 
            : 'translateY(0)',
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        {/* Header with close button and swipe handle */}
        <div 
          className="mobile-sidebar-header"
          ref={headerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mobile-sidebar-handle" />
          <div className="mobile-sidebar-title-row">
            <h2>日本病院マップ</h2>
            <button 
              className="mobile-sidebar-close"
              onClick={onClose}
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="mobile-sidebar-scroll">
          {/* Simulation Control */}
          <div className="simulation-control">
            <button 
              className={`simulation-button ${isSimulating ? 'stop' : 'start'}`}
              onClick={onToggleSimulation}
            >
              {isSimulating ? '⏸️ 停止' : '▶️ シミュレーション開始'}
            </button>
            
            <div className="control-row">
              <button 
                className="reset-button"
                onClick={onReset}
                disabled={isSimulating}
              >
                🔄 リセット
              </button>
              <button 
                className="settings-button"
                onClick={onOpenSettings}
                disabled={isSimulating}
              >
                ⚙️ 設定
              </button>
            </div>

            {isSimulating && (
              <div className="speed-control">
                <span className="speed-label">速度:</span>
                <div className="speed-buttons">
                  {speedOptions.map(option => (
                    <button
                      key={option.value}
                      className={`speed-button ${simulationSpeed === option.value ? 'active' : ''}`}
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
              placeholder="病院または救急車を検索..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="filters">
            <h3>レイヤー</h3>
            <label>
              <input
                type="checkbox"
                checked={filters.hospitals}
                onChange={() => onFilterChange('hospitals')}
              />
              <span>🏥 病院</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.ambulances}
                onChange={() => onFilterChange('ambulances')}
              />
              <span>🚑 救急車</span>
            </label>
            <label className="indent">
              <input
                type="checkbox"
                checked={showOnlyEnRoute}
                onChange={(e) => onEnRouteChange(e.target.checked)}
                disabled={!filters.ambulances || showOnlyIdle}
              />
              <span>搬送中のみ</span>
            </label>
            <label className="indent">
              <input
                type="checkbox"
                checked={showOnlyIdle}
                onChange={(e) => onIdleChange(e.target.checked)}
                disabled={!filters.ambulances || showOnlyEnRoute}
              />
              <span>待機中のみ</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.discoveryPoints}
                onChange={() => onFilterChange('discoveryPoints')}
              />
              <span>📍 発見地点</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.routes}
                onChange={() => onFilterChange('routes')}
              />
              <span>🔗 ルート</span>
            </label>
          </div>

          <div className="people-count-filter">
            <h3>人数フィルター</h3>
            <div className="button-group">
              {peopleCountOptions.map(option => (
                <button
                  key={option.value}
                  className={`filter-button ${peopleCountFilter === option.value ? 'active' : ''}`}
                  onClick={() => onPeopleCountChange(option.value)}
                  disabled={!filters.discoveryPoints}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="info">
            <h3>統計</h3>
            <p>🏥 病院: {stats.hospitals}</p>
            <p>🚑 救急車: {stats.ambulances}</p>
            <p>📍 発見地点: {stats.discoveryPoints}</p>
            <p>🛣️ アクティブルート: {stats.activeRoutes}</p>
          </div>

          <div className="legend">
            <h3>ルート優先度</h3>
            <div className="legend-item">
              <div className="legend-line" style={{ background: '#EA580C' }}></div>
              <span>緊急</span>
            </div>
            <div className="legend-item">
              <div className="legend-line" style={{ background: '#DC2626' }}></div>
              <span>高</span>
            </div>
            <div className="legend-item">
              <div className="legend-line" style={{ background: '#0891B2' }}></div>
              <span>中</span>
            </div>
            <div className="legend-item">
              <div className="legend-line" style={{ background: '#059669' }}></div>
              <span>低</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
