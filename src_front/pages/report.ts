// Importaciones
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
import "../components/header";
import "../components/button";
import { activateDropzone } from "../lib/dropzone";
import { state } from "../../src_front/state";
import { Router } from "../../node_modules/@vaadin/router";
import  Swal from "sweetalert2"


// Variables locales
const csPet = state.getReportPet();
let URLuri = null;
let coordinatesArray = [];
let lastCoordinate;
let email;

// Clase Report
export class Report extends HTMLElement {
  constructor() {
    super();
  }
  // Connected Callback
  connectedCallback(): void {
    let user = state.getUserData()
    email= user.email
    this.render();
    
  
    // Dropzone

    let myDropzone = activateDropzone("dropzone");
   
    Dropzone.autoDiscover = false;
    myDropzone.on("thumbnail", (file) => {
      if (file.accepted) {
        URLuri = file.dataURL;
      } else {
        console.log("Lo siento el archivo presenta una falla");
      }
    });

    // MapBox
    const MAPBOX_TOKEN =
      process.env.TOKEN_MAPBOX ||
      "pk.eyJ1IjoiZ3VpZG9kZXZqc2pyIiwiYSI6ImNsYng0ZG13MjE4b2Ezb3FvaWdlOWx2bjIifQ.u6htqs0dnoZ48UArWEAAxQ";
    const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

    /* MapBox: HTML */
    const mapContainer: any = this.querySelector(
      ".map-container"
    ) as HTMLElement;
    mapContainer.innerHTML = `
    <div class="contenedor-search">
        <label class="contenedor-search__label" for="q">Escriba el nombre de la ciudad o barrio en el que quiera establecer 
          el radio de busqueda de su mascota, luego puede hacer una marca
          con el click del mouse y la ultima marca que realize se guardara 
          como la ubicación en donde se perdío.</label>
        <input name="q" type="search" id="q" class="contenedor-search__input" />
    </div>
    <btn-custom class="button button-search" text="Buscar" color="#97EA9F" >Buscar</btn-custom>
        <div id="map-container" style="width: 100%; height: 310px;" > 
    </div>
    `;

    // Mapbox Function
    function iniciarMap() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZ3VpZG9kZXZqc2pyIiwiYSI6ImNsYng0ZG13MjE4b2Ezb3FvaWdlOWx2bjIifQ.u6htqs0dnoZ48UArWEAAxQ";

      let map = new mapboxgl.Map({
        container: "map-container",
        style: "mapbox://styles/mapbox/streets-v11",
      });
      const inputSearch = document.querySelector(
        ".contenedor-search__input"
      ) as any;
      const botonSearch = document.querySelector(".button-search") as any;
      botonSearch.addEventListener("click", (e) => {
        e.preventDefault();
        csPet.ubication = inputSearch.value;
        if (inputSearch.value) {
          mapboxClient.geocodeForward(
            inputSearch.value,
            {
              country: "ar",
              autocomplete: true,
              language: "es",
            },
            function (err, data, res) {
              const firstResult = data.features[0];
              const [lng, lat] = firstResult.geometry.coordinates;
              coordinatesArray.push({ lng, lat });
              const marker = new mapboxgl.Marker()
                .setLngLat(firstResult.geometry.coordinates)
                .addTo(map);
              map.setCenter(firstResult.geometry.coordinates);
              map.setZoom(14);
            }
          );
        } else {
          alert("Por favor ingrese una ubicación");
        }
      });

      const marker = new mapboxgl.Marker();

      function add_marker(event) {
        let coordinates = event.lngLat;
        let coordinate = {
          lng: coordinates.lng,
          lat: coordinates.lat,
        };
        coordinatesArray.push(coordinate);
        marker.setLngLat(coordinates).addTo(map);
      }

      map.on("click", add_marker);
    }

    // Ejecutando la funcion del mapbox
    iniciarMap();
  }

  render() {
    this.classList.add("container");
    let style = document.createElement("style");

    // Estilos de la pagina
    style.innerHTML = `
      .container{
        position:relative;
        width:100vw;
        height:100vh;
      }

      .container-body{
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        align-items:center;
        height:auto;
        padding:20px;
      }
      .container-body div{
        margin: 20px 0;
        display:flex;
        flex-direction:column;
      }
      .report__petname{
        width:100%;

      }
      .report__petname label{
        font-size:16px;
      }
      .report__petname input{
        height:50px;
        border-radius:4px;
        font-size:16px;
        font-weight:500;
      }
      .dropzone{
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .contenedor-search__input{
        height:50px;
        border-radius:4px;
        font-size:16px;

      }
      .button-search{
        align-self:center;
      }
      .buttons{
        width:100%;
        display:flex;
        flex-direction:column;
        justify-content:space-evenly;
        align-items:center;
        height:150px;
      }

      .dz-details {
        padding: 0 !important;
      }
      .dropzone .dz-preview{
        width:100% !important;
        height:100% !important;
      }
      .dropzone .dz-preview .dz-image{
        width:100% !important;
        height:100% !important;
      }
      .dropzone .dz-preview .dz-image img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      .dropzone .dz-preview.dz-image-preview .dz-details,
      .dropzone .dz-preview .dz-progress {
        display:none !important;
      }
      .dropzone .dz-preview .dz-imag{
        width:100% !important;
        height:100%;
        object-fit:cover;
      }

      @media (min-width:970px){

        .container-body{
          margin:0 auto;
          width:85%;
        }

      }

    `;

    // HTML de la pagina
    this.innerHTML = `
            
            <header-custom class="header" email="${email}"></header-custom>
            <div class="container-body">
            <h1>Reportar mascota perdida</h1>
            <div class="report__petname">
                <label for="name">Nombre</label>
                <input type="text" id="name" class="name">
            </div>
            <article class="dropzone">

            </article>
                <div class="map-container"></div>
            <div class="buttons">
                <btn-custom text="Reportar como perdido" color="#FF9DF5" class="save"></btn-custom>
                <btn-custom text="Cancelar" color="#CDCDCD" class="cancelar"></btn-custom>
            </div>
            </div>
            
            
        `;
        // Variables de la pagina renderizada
    let name = this.querySelector(".name") as any;
    let $btnSave = this.querySelector(".save");
    let $btnCancelar = this.querySelector(".cancelar")
    $btnSave.addEventListener("click", async (e) => {
      Swal.fire({
        icon:"warning",
        title:"Cuidado los datos se estan almacenando, puede tardar unos segundos",  
        html:`Los datos se estan guardando, agradecemos su paciencia...`,
    })
      if (URLuri) {
        csPet.petName = name.value;
        lastCoordinate = coordinatesArray[coordinatesArray.length - 1];
        try {
          // Subir imagen
          let urlSecure = await state.uploadImage({ url: URLuri });
          urlSecure = urlSecure.url;
          csPet.img = urlSecure;
          csPet.lat = lastCoordinate.lat;
          csPet.lng = lastCoordinate.lng;
          let opcionBD = {
            name: csPet.petName,
            img: csPet.img,
            lat: csPet.lat,
            lng: csPet.lng,
          };
          // Creando en la base de datos
          let petBD = await state.createPetDb(opcionBD);
          csPet.petId = petBD;
          let opcionAlgolia = {
            name: csPet.petName,
            lat: csPet.lat,
            lng: csPet.lng,
            id:petBD
          };
          let petAlgolia = await state.createPetAlgoliaDb(opcionAlgolia);
          if (petAlgolia.msg && petBD) {
            Swal.fire({
              title: 'Waiting',
              html: 'Se ha creado su publicacion',
              timer: 1000,
              timerProgressBar: true,
          })
            Router.go("/petsreported");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Lo siento algo fallo en la carga de datos");
      }
    },{once:true});
    $btnCancelar.addEventListener("click",e=>{
      Router.go("/home")
    })
    this.appendChild(style);
  }
}

customElements.define("report-page", Report);

