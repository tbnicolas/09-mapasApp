import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadoColor{
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number,number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
     .mapa-container{
      width: 100%;
      height: 100%;
     }
     .list-group{
       position: fixed;
       top: 20px;
       right: 20px;
       z-index: 9999;
     }
     li{
       cursor: pointer;
     }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;

  zoomLevel: number = 15;
  center: [number, number] = [-74.82056636251767,11.008696960530235 ];

  //Arreglo de marcadores

  marcadores: MarcadoColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom: this.zoomLevel
    });

    //Aqui se puede colocar imagenes
    const markerHtml: HTMLElement = document.createElement('div');

    markerHtml.innerHTML = 'Hola Mundo'
    this.leerLocalStorage();

    //const marker = new mapboxgl.Marker(
     /*  {
        element: markerHtml
      } */
    //)
    //.setLngLat( this.center )
    //.addTo( this.mapa );

  }

  irMarcador( marcador: mapboxgl.Marker | undefined){

    this.mapa.flyTo({
      center: marcador?.getLngLat()
    });

  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    console.log(color);

    const nuevoMarcador = new mapboxgl.Marker({
      draggable:true,
      color
    })
    .setLngLat( this.center )
    .addTo( this.mapa );

    this.marcadores.push(
      {
        color,
        marker: nuevoMarcador
      }
    );



    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', ()=> {

      this.guardarMarcadoresLocalStorage();

    });

  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadoColor[] = [];

    this.marcadores.forEach( m => {

      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push(
        {
          color: color,
          centro: [lng,lat]
        }
      )

    })


    localStorage.setItem('marcadores', JSON.stringify( lngLatArr ));



  }


  leerLocalStorage() {

    if (!localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadoColor[] = JSON.parse(localStorage.getItem('marcadores')! );

    console.log( lngLatArr );

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable: true
      })
      .setLngLat(m.centro!)
      .addTo( this.mapa );

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', ()=> {

        this.guardarMarcadoresLocalStorage();

      });



    })
  }

  borrarMarcador( i: number ) {

    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1);

    this.guardarMarcadoresLocalStorage();

  }

}
