import { Router } from "@vaadin/router";
import Swal from "sweetalert2";
import { state } from "../state";
export class WelcomePage extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }
  render() {
    const userImg = require("url:../assets/user.png");
    let div = document.createElement("div");
    div.classList.add("container");
    let style = document.createElement("style");
    style.innerHTML = `
            .container{
                width:100vw;
                height:100vh;
                background:  linear-gradient(to right,#EF3B36, #ffffff);
                display:flex;
                justify-content:center;
                align-items:center;
            }
            .form{
                width:75vw;
                height:70vh;
                display:flex;
                flex-direction:column;
                justify-content:space-evenly;
                // background-color:blue;
            }
            .form__img{
                display:flex;
                justify-content:center;
                align-items:center;
            }
            .form__img img{
                width:100px;
            }
            .inputs{
                height:35%;
                display:flex;
                flex-direction:column;
                justify-content:space-evenly;
            }
            .inputs input{
                height:30px;
                border-radius:3px;
                font-size:20px;
            }
            .btn{
                display:flex;
                justify-content:center;
            }
            .form__btnLogin{
                font-size:2em;
                width:70%;
                height:50px;
                border-radius:3px;
                color:#fff;
                background-color:#FED51B;
            }
            .helper{
                display:flex;
                flex-direction:column;
                align-items:center;
            }
            .form__btnCreate{
                font-size:1em;
                color:#000;
            }
        `;
    div.innerHTML = `
            <form class="form">
                <div class="form__img">
                    <img src="${userImg}">
                </div>
                <div class="inputs">
                    <input type="email" placeholder="email" class="email">
                    <input type="password" placeholder="password" class="password">
                </div>
                <div class="btn">
                <button class="form__btnLogin">Ingresar</button>
                </div>
                <div class="helper">
                    <h3>¿Aun no tienes una cuenta?</h3>
                    <a href="#" class="form__btnCreate">Crear cuenta</a>
                </div>
                </form>
                
        `;
    let form = div.querySelector(".form") as any;
    let $linkCreate = div.querySelector(".form__btnCreate");
    let $email = div.querySelector(".email") as any;
    let $password = div.querySelector(".password") as any;
    $linkCreate.addEventListener("click", (e) => {
      Router.go("/create");
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const email = $email.value;
        const password = $password.value;
        if (email === "" && password === "") {
            Swal.fire({
                icon: "error",
                title: "Informacion no valida",
                html: "Por favor introduzcas los campos solicitados",
              });
        } else {
          const token = await state.authUser(email, password);

          if (token.token) {
            const data = await state.getUserDataFromDb();
            form.reset();
            Router.go("/home");
          } else {
            Swal.fire({
              icon: "warning",
              title: "Informacion no valida",
              html: "Su contraseña o email son incorrectos",
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    this.shadow.appendChild(style);
    this.shadow.appendChild(div);
  }
}
customElements.define("welcome-page", WelcomePage);
