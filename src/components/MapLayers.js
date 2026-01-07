import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';
import { useTranslation } from 'react-i18next';

const { BaseLayer } = LayersControl;

const MapLayers = () => {
  const { t } = useTranslation();

  return (
    <LayersControl position="topright">
      <BaseLayer name={`🗾 ${t('map.paleMap')}`}>
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        />
      </BaseLayer>

      <BaseLayer name={`🗾 ${t('map.standardMap')}`}>
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
      </BaseLayer>

      <BaseLayer name={`🗾 ${t('map.reliefMap')}`}>
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png"
        />
      </BaseLayer>

      <BaseLayer checked name={`📷 ${t('map.satelliteMap')}`}>
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
        />
      </BaseLayer>

      <BaseLayer name={`🌍 ${t('map.osmMap')}`}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>

      <BaseLayer name="🌙 Dark Mode">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
      </BaseLayer>
    </LayersControl>
  );
};

export default MapLayers;
