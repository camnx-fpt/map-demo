import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * Component to expose map instance to parent via ref
 */
const MapController = ({ mapRef }) => {
  const map = useMap();

  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);

  return null;
};

export default MapController;
