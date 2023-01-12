// Importaciones
import "../components/header";
import "../components/button";
import { state } from "../state";
import Swal from "sweetalert2";
import { Router } from "@vaadin/router";

let email: string;
let name: string;

// Clase Mis datos
export class MisDatos extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    // Variables locales
    const cs = state.getUserData();
    let dataLocalStorage = JSON.parse(localStorage.getItem("dataUser"));
    email = cs.email || dataLocalStorage.email;
    name = cs.name || dataLocalStorage.name;
    this.classList.add("container");
    let style = document.createElement("style");
    style.innerHTML = `
            .container{
                position:relative;
            }
            .container-body{
                width:100%;
                height:90vh;
                display:flex;
                flex-direction:column;
                padding:20px;
            }
            .form{
                width:100;
                height:100%;
                display:flex;
                flex-direction:column;
                justify-content:space-evenly;
            }
            .form div{
                width:100%;
                display:flex;
                flex-direction:column;
                margin:10px 0;
            }
            .form div label{
                margin:10px 0;
                font-size:20px;
                border-radius:4px;
            }
            .form div input{
                height:50px;
                font-size:20px;
            }
            .btn {
                align-self:center;
            }
            @media (min-width:970px){

                .container-body{
                  margin:0 auto;
                  width:85%;
                }
        
              }
        `;
    this.innerHTML = `
            <header-custom email="${email}"></header-custom>
            <div class="container-body">
                <h1>Mis datos</h1>
                <form class="form">
                    <div class="form__name">
                        <label for="name">Nombre</label>
                        <input type="text" class="name" id="name" value="${name}">
                    </div>
                    <div class="form__password">
                        <div>
                            <label for="pass1">Contraseña</label>
                            <input type="password" class="pass1" id="pass1">
                            <label for="pass2">Repetir</label>
                            <input type="password" class="pass2" id="pass2">
                        </div>
                    </div>
                    <div class="buttom">
                        <btn-custom text="Guardar" color="#FF9DF5" class="btn"></btn-custom>
                    </div>
                </form>
            </div>

            `;
    // Funciones y variables del custom element
    const $btn = this.querySelector(".btn");
    let $name = this.querySelector(".name") as any;
    let $pass1 = this.querySelector(".pass1") as any;
    let $pass2 = this.querySelector(".pass2") as any;
    $btn.addEventListener("click", async (e) => {
      const userRes = await state.updateDataUser({ name: $name.value });
      if ($pass1 !== "" && $pass2 !== "") {
        if ($pass1.value === $pass2.value) {
          const resPass = await state.updatePassword({ password: $pass1 });
          Swal.fire({
            icon: "success",
            text: "Perfecto",
            html: "Los datos han sido modificados",
          });
          Router.go("/home");
        } else {
          console.log("Las contraseñas no son iguales");
        }
      }
      Swal.fire({
        icon: "success",
        text: "Perfecto",
        html: "Los datos han sido modificados",
      });
      Router.go("/home");
    });

    this.appendChild(style);
  }
}

customElements.define("datos-page", MisDatos);
