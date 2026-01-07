import React, { useState } from 'react';
import { Polyline } from 'react-leaflet';

const RoutePolyline = ({
  route,
  coordinates,
  isHoveredViaHospital,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = (e) => {
    // Stop event propagation to prevent multiple handlers firing
    e.originalEvent?.stopPropagation();
    setIsHovered(true);
    onHover && onHover(route.id, true);
  };

  const handleMouseOut = (e) => {
    // Stop event propagation to prevent multiple handlers firing
    e.originalEvent?.stopPropagation();
    setIsHovered(false);
    onHover && onHover(route.id, false);
  };

  if (!coordinates) return null;

  const isHighlighted = isHovered || isHoveredViaHospital;

  return (
    <>
      {/* Segment 1: Ambulance -> Discovery (when at discovery) */}
      {coordinates.segment1 && (
        <Polyline
          positions={coordinates.segment1}
          color={route.color}
          weight={isHighlighted ? 6 : 3}
          opacity={isHighlighted ? 1 : 0.7}
          dashArray="5, 10"
          eventHandlers={{
            mouseover: handleMouseOver,
            mouseout: handleMouseOut,
          }}
        />
      )}

      {/* Segment 2: Ambulance -> Hospital (when transporting) */}
      {coordinates.segment2 && (
        <Polyline
          positions={coordinates.segment2}
          color={route.color}
          weight={isHighlighted ? 6 : 3}
          opacity={isHighlighted ? 1 : 0.7}
          eventHandlers={{
            mouseover: handleMouseOver,
            mouseout: handleMouseOut,
          }}
        />
      )}
    </>
  );
};

export default RoutePolyline;
