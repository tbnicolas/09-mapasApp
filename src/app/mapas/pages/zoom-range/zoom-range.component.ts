import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import * as L from 'leaflet';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      width: 100%;
      height: 100%;
    }

    .row{
      border-radius: 5px;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      background-color: white;
      z-index:9999;
      width: 400px
    }

    `
  ]
})
export class ZoomRangeComponent implements /* OnInit, */ AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;

  zoomLevel: number = 10;
  center: [number, number] = [-74.82056636251767,11.008696960530235 ];


  constructor() { }

  ngOnDestroy(): void {

    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});

  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
    });

    /* const geojsonFeature = {
      type: 'Feature' as const,
      properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!'
      },
        geometry: {
        type: 'Point' as const,
        coordinates: [-104.99404, 39.75621]
      }
    };

    L.geoJSON(geojsonFeature).addTo(map); */

    this.mapa.on('zoom',(event) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend',(event) => {
      if ( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo(18);
      }
    });

    this.mapa.on('move',(event) => {
      const target = event.target;
      const { lng, lat} =target.getCenter();
      //console.log(target.getCenter())
      this.center = [ lng, lat ];
    });

    /* this.mapa.on('load',
      (ev)=>{
        console.log(ev);
        this.mapa.addSource(
          'hola',
          {
            'type': 'geojson',
            'data':{}
          }
        )
      }
    ) */

  }

  zoomOut() {

    this.mapa.zoomOut();
    this.zoomLevel = this.mapa.getZoom();

  }


  zoomIn() {

    this.mapa.zoomIn();

    this.zoomLevel = this.mapa.getZoom();
  }

  zoomCambio( valor: string) {

    this.mapa.zoomTo( Number(valor) );

  }



}
