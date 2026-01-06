import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FocusDropdown.css";

const FocusDropdown = ({ ambulances, discoveryPoints, hospitals, onFocus }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("ambulances");

  const getAmbulanceLabel = (ambulance) => {
    let status = t("status.idle");
    if (ambulance.status === "en_route") {
      if (ambulance.phase === "to_discovery") {
        status = t("focus.toDiscovery");
      } else if (ambulance.phase === "at_discovery") {
        status = t("focus.atDiscovery");
      } else if (ambulance.phase === "to_hospital") {
        status = t("focus.toHospital");
      }
    }
    return `${t("focus.ambulance")} #${ambulance.id} - ${status}`;
  };

  const getDiscoveryLabel = (discovery) => {
    return `${t("focus.discovery")} #${discovery.id} - ${discovery.peopleCount} ${t("filter.people")}`;
  };

  const getHospitalLabel = (hospital) => {
    return `${hospital.name}`;
  };

  const handleItemClick = (item, type) => {
    onFocus(item.lat, item.lng, item.id, type);
    setIsOpen(false);
  };

  const renderItems = () => {
    switch (selectedType) {
      case "ambulances":
        return ambulances.map((ambulance) => (
          <div
            key={ambulance.id}
            className="focus-item"
            onClick={() => handleItemClick(ambulance, "ambulance")}
          >
            <span className="focus-icon">🚑</span>
            <span className="focus-label">{getAmbulanceLabel(ambulance)}</span>
          </div>
        ));
      case "discoveryPoints":
        return discoveryPoints.map((discovery) => (
          <div
            key={discovery.id}
            className="focus-item"
            onClick={() => handleItemClick(discovery, "discovery")}
          >
            <span className="focus-icon">📍</span>
            <span className="focus-label">{getDiscoveryLabel(discovery)}</span>
          </div>
        ));
      case "hospitals":
        return hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="focus-item"
            onClick={() => handleItemClick(hospital, "hospital")}
          >
            <span className="focus-icon">🏥</span>
            <span className="focus-label">{getHospitalLabel(hospital)}</span>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="focus-dropdown">
      <button
        className="focus-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🎯 {t("focus.title")}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <div className="focus-menu">
          <div className="focus-tabs">
            <button
              className={`focus-tab ${selectedType === "ambulances" ? "active" : ""}`}
              onClick={() => setSelectedType("ambulances")}
            >
              🚑 {t("layers.ambulances")} ({ambulances.length})
            </button>
            <button
              className={`focus-tab ${selectedType === "discoveryPoints" ? "active" : ""}`}
              onClick={() => setSelectedType("discoveryPoints")}
            >
              📍 {t("layers.discoveryPoints")} ({discoveryPoints.length})
            </button>
            <button
              className={`focus-tab ${selectedType === "hospitals" ? "active" : ""}`}
              onClick={() => setSelectedType("hospitals")}
            >
              🏥 {t("layers.hospitals")} ({hospitals.length})
            </button>
          </div>

          <div className="focus-items">
            {renderItems().length > 0 ? (
              renderItems()
            ) : (
              <div className="focus-empty">{t("focus.selectItem")}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusDropdown;
