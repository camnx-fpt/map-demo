import React, { useState, useRef, useEffect } from 'react';
import { Polyline, useMapEvents } from 'react-leaflet';

const RoutePolyline = ({
  route,
  coordinates,
  isHoveredViaHospital,
  onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const segment1Ref = useRef(null);
  const segment2Ref = useRef(null);

  // Listen to map view changes and force a redraw of the polyline to prevent visual artifacts
  useMapEvents({
    zoomend: () => {
      segment1Ref.current?.redraw?.();
      segment2Ref.current?.redraw?.();
    },
    moveend: () => {
      segment1Ref.current?.redraw?.();
      segment2Ref.current?.redraw?.();
    },
    viewreset: () => {
      segment1Ref.current?.redraw?.();
      segment2Ref.current?.redraw?.();
    },
    resize: () => {
      segment1Ref.current?.redraw?.();
      segment2Ref.current?.redraw?.();
    },
  });

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
          smoothFactor={1}
          noClip={false}
          ref={segment1Ref}
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
          smoothFactor={1}
          noClip={false}
          ref={segment2Ref}
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
