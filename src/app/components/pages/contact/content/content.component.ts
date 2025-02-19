import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  map: L.Map | L.LayerGroup<any>;
  homeCoords = {

    lat: 51.5,
    lon: -0.09
  };

  popupText = "Slices - Pizzaria Shop";

  markerIcon = {
    icon: L.icon({
      iconSize: [32, 32],
      iconAnchor: [15, 32],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "assets/img/misc/marker.png"
    })
  };

  options = {
    layers: [
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png", {
        maxZoom: 16,
        attribution: "&copy; Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      })
    ],
    zoom: 16,
    maxZoom: 16,
    scrollWheelZoom: false,
    center: L.latLng(this.homeCoords.lat, this.homeCoords.lon)
  };

  initMarkers() {
    const popupInfo = `<p style="color: #ED4E53; background-color: white">${this.popupText
      }</p>`;

    L.marker([this.homeCoords.lat, this.homeCoords.lon], this.markerIcon)
      .addTo(this.map)
      .bindPopup(popupInfo);
  }

  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
    this.initMarkers();
  }
  ngOnInit() {
  }

}
