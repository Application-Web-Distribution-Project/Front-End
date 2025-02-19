import { Component, OnInit } from '@angular/core';
import restaurant from '../../../../data/restaurant.json';
import * as L from 'leaflet';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor() { }
  public locations = restaurant;
  // Map
  map: L.Map | L.LayerGroup<any>;
  mapdata = {
    lat:40.711652,
    lon:-73.963877,
  }
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
    center: L.latLng(this.mapdata.lat, this.mapdata.lon)
  };
  initMarkers() {
    const popupInfo = `<p style="color: #ED4E53; background-color: white">${this.popupText
      }</p>`;
    this.locations.map(location => {
      L.marker([location.mapdata[0], location.mapdata[1]], this.markerIcon)
        .addTo(this.map)
        .bindPopup(popupInfo);
        
    });

  }

  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
    this.initMarkers();
  }
  ngOnInit(): void {
  }

}
