// Importaciones
import "../components/header";
import "../components/button";
import "../components/cardEdits";
import { state } from "../state";

// Variables locales
let cs = state.getState();
let dataPet = cs.pets;
let email: string;
let name: string;
// Clase Mis datos
export class PetsReported extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
       await this.render();
  }
  async render() {
    await state.getAllPetsUserMe();
    dataPet = state.data.pets;
    const petsHtml = dataPet.map((pet) => {
          return`
                <cardedit-custom img=${pet.img} name=${pet.name} petId=${pet.id} lat=${pet.lat} lng=${pet.lng} state=${pet.state}></cardedit-custom>
            `
        })
    const cs = state.getUserData();
    let dataLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
    email = cs.email || dataLocalStorage.email;
    name = cs.name || dataLocalStorage.name;
    this.classList.add("container");
    let style = document.createElement("style");
    style.innerHTML = `
        .container-body{
            width:100%;
            height:100%;
            text-align:center;
        }
        .cards{
            width:100%;
            display:grid;
            gap:1rem;
            grid-auto-rows:22rem;
            grid-template-columns:repeat(auto-fill,minmax(335px,1fr));
            justify-items:center;
            text-align:center;
        }
    `;
    this.innerHTML = `
            <header-custom email=${email}></header-custom>
            <div class="container-body">
                <h1>Mis Mascotas Reportadas</h1>
                <div class="cards">
                ${(dataPet.length > 0) ? petsHtml.join("") : `<div class="">No tienes ninguna mascota reportada</div>`}
                </div>
               
            </div>

        `;
    this.appendChild(style);
  }
}

customElements.define("petsreported-page", PetsReported);

// <cardedit-custom img="https://res.cloudinary.com/da9s9ok0k/image/upload/v1673069800/mnm0syy398vuxhso2nc4.jpg" name="mike"></cardedit-custom>
