import React from 'react';
import { TileLayer, LayersControl } from 'react-leaflet';

const { BaseLayer } = LayersControl;

const MapLayers = () => {
  return (
    <LayersControl position="topright">
      <BaseLayer name="🗾 淡色地図 (Pale)">
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      
      <BaseLayer name="🗾 標準地図 (Standard)">
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      
      <BaseLayer name="🗾 色別標高図 (Relief Map)">
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      
      <BaseLayer checked name="📷 写真 (Satellite)">
        <TileLayer
          attribution='<a href="http://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg"
        />
      </BaseLayer>
      
      <BaseLayer name="🌍 OpenStreetMap">
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
