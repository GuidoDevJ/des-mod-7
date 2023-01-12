import "../components/header";
import "../components/button";
import "../components/card";
import { state } from "../../src_front/state";
import { mostrarErrores, mostrarPosicion, opciones } from "../helpers/geojavascript";
import  Swal from "sweetalert2"
let email: string;
let emailReported:string;
// Clase Home
export class Home extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  render() { 
    // Variables
    let dataLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
    email = dataLocalStorage.email;
    let div = document.createElement("div");
    let style = document.createElement("style");

    style.innerHTML = `
        .container{
            padding:10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
            h1{
                font-size:45px;
                font-weight:700;
                margin-bottom:100px;
            }
            p{
                text-align:center;
                font-size:16px;
                font-weight:500;
                margin-bottom:50px;
            }
            .btn__container{
                width:100%;
                display:flex;
                justify-content:center;
            }
            .cards{
                width:100%;
                display:grid;
                gap:1rem;
                grid-auto-rows:22rem;
                grid-template-columns:repeat(auto-fill,minmax(335px,1fr));
                justify-items:center;
            }
        `;
    div.innerHTML = `
        <header-custom email=${email}></header-custom>
        <div class="container">
            <h1>Mascotas perdidas cerca tuyo</h1>
            <p class="text">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</p>
                <div class="btn__container">
                    <btn-custom text="Dar mi ubicacion" color="#FF9DF5" class="btn__location"></btn-custom>
                </div>
            <div class="cards">
                
            </div>
            
        </div>
        `;
        let $container = div.querySelector(".container")
        let $cardContainer = div.querySelector(".cards")
        let $btnContainer = div.querySelector(".btn__container")
        let $btn = div.querySelector(".btn__location") as any
        let text = div.querySelector(".text")
        $btn.addEventListener("click",async (e)=>{
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(mostrarPosicion, mostrarErrores, opciones);
                // Alerta de espera
                Swal.fire({
                    title: 'Auto close alert!',
                    html: 'Buscando en la base de datos.',
                    timer: 2000,
                    timerProgressBar: true,
                })
                // Buscando en la base de datos
               setTimeout(async() => {
                let datosPets = await state.getAllPetsNear(state.getUserData().lat,state.getUserData().lng)
                if(datosPets.length > 0){
                    $container.removeChild(text)
                    $container.removeChild($btnContainer)
                }
                let htmlElePets = await datosPets.map(async(pet)=>{
                    let infoPet= await state.getPetById(pet.objectID)
                    let userPet = await state.getUserById(infoPet.UserId)
                    emailReported = userPet.email
                    return $cardContainer.innerHTML += `
                    <card-custom img=${infoPet.img} name=${infoPet.name} state=${infoPet.state} email=${userPet.email}></card-custom>
                    `})
                
               },1500);
               
                }else {
                alert("Tu navegador no soporta la geolocalización, actualiza tu navegador.");
            
        }})
    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }
}
customElements.define("home-page", Home);

