import {Component} from '@angular/core';
import {SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow, LatLngLiteral} from 'angular2-google-maps/core';
import {HTTP_PROVIDERS} from '@angular/http';

import {PoiService} from './poi.service';

@Component({
  selector: 'my-app',
  directives: [SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow], // this loads all angular2-google-maps directives in this component
  providers: [PoiService, HTTP_PROVIDERS],
  // the following line sets the height of the map - Important: if you don't set a height, you won't see a map!!
  styles: [`
    .sebm-google-map-container {
      height: 600px;
    }
  `],
  templateUrl: 'templates/map.html'
})
export class AppComponent{
  lat: number = 51.030812;
  lng: number = 13.730180;
  zoom: number = 15;
  latQuery: number = 51.030812;
  lngQuery: number = 13.730180;
  latQueryLast: number;
  lngQueryLast: number;
  markerInfoText : string;

  public poiList = [];
  //public selectedPoi : object;

  constructor(private poiService: PoiService) {

    this.loadData();
  }

  processCenterChange(coordinates : LatLngLiteral) {
	  this.latQuery = coordinates.lat;
	  this.lngQuery = coordinates.lng;
  }

  processMarkerClick(poi) {
    this.poiService.getPoi(poi.href).subscribe(p => poi.name = p.name.replace(/\n/g, "<br />"));
  }

  getIconUrl(category : string) {
    // find icons at: https://sites.google.com/site/gmapsdevelopment/
    if (category == "Gas Station") {
      return "http://maps.google.com/mapfiles/ms/micons/gas.png";
    } else if (category == "Supermarket") {
      return "http://maps.google.com/mapfiles/ms/micons/convienancestore.png";
    } else if (category == "Restaurant") {
      return "http://maps.google.com/mapfiles/ms/micons/restaurant.png";
    }
    return "http://maps.google.com/mapfiles/ms/micons/red.png";
  }

  doQuery() {
    // only reload from server if things changed
    if (this.latQueryLast != this.latQuery && this.lngQueryLast != this.latQuery) {
      this.latQueryLast = this.latQuery;
      this.lngQueryLast = this.lngQuery;

      this.loadData();
    }
  }

  loadData() {
	   var featureCollection;
     this.poiService.getPoiList(this.latQuery, this.lngQuery).subscribe(resultList => this.poiList = resultList);
  }
}
