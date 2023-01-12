// Importaciones
import "../components/header";
import "../components/button";
import Dropzone from "dropzone";
import mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
import { activateDropzone } from "../lib/dropzone";
import { state } from "../../src_front/state";
import { Router } from "../../node_modules/@vaadin/router";
import  Swal from "sweetalert2"


// Variables locales
let petLocalStorage;

let statePet;
let csPet;
let petName;
let img;
let URLuri = null;
let coordinatesArray = [];
let lastCoordinate;
let cs;
// Clase Report
export class EditPet extends HTMLElement {
  constructor() {
    super();
  }
  // Connected Callback
  connectedCallback(): void {
    petLocalStorage = JSON.parse(localStorage.getItem("dataPet"))
    console.log(petLocalStorage)
    cs = state.getUserData()
    csPet = state.getReportPet();
    petName = csPet.petName || petLocalStorage.petName
    img = csPet.img || petLocalStorage.img
    const lat = csPet.lat || petLocalStorage.lat
    const lng = csPet.lng || petLocalStorage.lng
    const petId = csPet.petId || petLocalStorage.petId
    statePet = csPet.state || petLocalStorage.state
    coordinatesArray.push({ lng, lat });
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
        center: [lng, lat],
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

      // Si existe una lat y una lng se posiciona el mapa sobre esa direccion
      if (lng && lat) {
        const newmarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map);
        map.setCenter([lng, lat]);
        map.setZoom(14);
      }
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
      .save{
        transition:all ease 100ms;
      }
      .save, .save:active{
        transform:translateY(6px);
        box-shadow: 0px 0px 0px rgb(20,52,90);
      }
      .despublicar{
        font-size:16px;
        color:red;
        margin-top:10px;
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
      .dropzone__img{
        width:100%;
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
            
            <header-custom class="header" email=${cs.email}></header-custom>
            <div class="container-body">
            <h1>Reportar mascota perdida</h1>
            <div class="report__petname">
                <label for="name">Nombre</label>
                <input type="text" id="name" class="name" value=${petName}>
            </div>
            <article class="dropzone">
            <div class="dz-default dz-message"><button class="dz-button" type="button"><img class="dropzone__img" src=${img}></button></div>
            </article>
                <div class="map-container"></div>
            <div class="buttons">
                <btn-custom text="Guardar" color="#FF9DF5" class="save"></btn-custom>
                <btn-custom text="Reportar como encontrado" color="#97EA9F" class="found"></btn-custom>
                <a href="#" class="despublicar">Despublicar</a>
            </div>
            </div>
            
            
        `;
    let name = this.querySelector(".name") as any;
    let $btnSave = this.querySelector(".save");
    let linkDespu = this.querySelector(".despublicar")
    let $btnFound = this.querySelector(".found")


    window.addEventListener("popstate", (event) => {
      this.innerHTML = "";
    });
// Boton encontrado
    $btnFound.addEventListener("click",e=>{
      Swal.fire({
        icon:"success",
        html:`${petName} ha sido notificado como encontrado`
      })
      statePet = true
    })
// Boton despublicar
    linkDespu.addEventListener("click",async e=>{

      e.preventDefault()
      Swal.fire({
        icon:"success",
        title:"Cuidado los datos se estan eliminando",  
        html:`Los datos de ${petName} estan siendo eliminados ...`,
    })
      let res = await state.deletePet()
      if(res){
        localStorage.removeItem("dataPet")
        Router.go("/petsreported")
      }
    })
    // Boton guardar cambios
    $btnSave.addEventListener("click", async (e) => {
      Swal.fire({
        icon:"warning",
        title:"Cuidado los datos se estan modificando",  
        html:`Los datos de ${petName} estan siendo modificados ...`,
    })
      csPet.petName = name.value;
      lastCoordinate = coordinatesArray[coordinatesArray.length - 1];
      try {
        if (URLuri !== null) {
          let urlSecure = await state.uploadImage({ url: URLuri });
          csPet.img = urlSecure.url;
        }

        csPet.lat = lastCoordinate.lat;
        csPet.lng = lastCoordinate.lng;
      
        let opcionAlgolia = {
          nombre: csPet.petName,
          lat: parseFloat(csPet.lat) ,
          lng: parseFloat(csPet.lng),
        };
          let petAlgolia = await state.updatePetDataAlgolia(opcionAlgolia);
        let opcionBD = {
          name: csPet.petName,
          img: csPet.img,
          lat: parseFloat(csPet.lat),
          lng: parseFloat(csPet.lng),
          state: statePet
        };

        let petBD = await state.updatePetDataDb(opcionBD);

        if (petBD && petAlgolia) {
        localStorage.removeItem("dataPet")

          Swal.fire({
            icon:"success",
            title:"Excelente",  
            html:`Los datos de ${csPet.petName} han sido modificados`,
        })
          Router.go("/petsreported");
        }else{
          Swal.fire({
            icon:"error",
            title:"Ups",  
            html:`Los datos de ${csPet.petName} no se han podido modificar, intente mas tarde`,
        })
        }
      } catch (error) {
        console.error(error);
      }
    },{once:true});
    this.appendChild(style);
  }
}

customElements.define("editpet-page", EditPet);
