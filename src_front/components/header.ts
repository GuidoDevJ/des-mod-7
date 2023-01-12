import { Router } from "@vaadin/router";
import { state } from "../state";

let patitas = require("url:../assets/patita.png")
let hambur = require("url:../assets/hambur.png")


export class Header extends HTMLElement{
    shadow = this.attachShadow({mode: 'open'}); 
        constructor(){
            super()
            this.render()
        }
     
        render(){
            let email = this.getAttribute("email")
            let header = document.createElement("header")
            header.classList.add("header")
            let style = document.createElement("style")
            style.innerHTML= `
                .header{
                    height:10vh;
                    background-color:#FF6868;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                }
                img{
                    width:40px;
                    height:40px;
                }
                img:nth-child(1){
                    margin-left:8px;
                }
                img:nth-child(2){
                    margin-right:8px;
                }
                .menu__options{
                    display:none;
                }
                .menu__options_active{
                    position:absolute;
                    z-index:100;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                    align-items:center;
                    background-color:#8AF1FF;
                    top:0;
                    right:0;
                    left:0;
                    bottom:0;
                }
                .menu__options_close{
                    width:100%;
                    display:flex;
                    justify-content:flex-end;
                }
                .cross{
                    margin-right:10px;
                    font-size:20px;
                    color:blue;
                    cursor:pointer;
                }
                .menu__options__links{
                    height:60%;
                    display:flex;
                    flex-direction:column;
                    justify-content:space-evenly;
                    align-items:center;
                }
                .menu__options__links > li{
                    list-style:none;
                }
                .menu__options__links > li > a{
                    font-size: 24px;
                    font-weight:bold;
                    text-decoration:none;
                }
                .menu__options__me{
                    height:40%;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                }
                .menu__options__me h3{
                    font-size:24px;
                }
                .menu__options__me a{
                    font-size:16px;
                    color:#C6558B;
                }
            `
            header.innerHTML= `
                <img src=${patitas}class="img__icon"/>
                <img src=${hambur} class="menu"/>
                <div class="menu__options">
                    <div class="menu__options_close">
                        <span class="cross">X</span>
                    </div>
                    <ul class="menu__options__links">
                        <li><a href="#" class="data">Mi data</a></li> 
                        <li><a href="#" class="reportPetsData">Mis mascotas reportadas</a></li> 
                        <li><a href="#" class="reportPet">Reportar mascota</a></li> 
                    </ul>
                    <div class="menu__options__me">
                        <h3 class="correo">${email}</h3>
                        <a  href="#" class="singout">Cerrar Session</a>
                    </div>
                </div>
                
                `
            let imgIcon = header.querySelector(".img__icon")
            let reportDataLink = header.querySelector(".reportPetsData")
            let reportPetLink= header.querySelector(".reportPet")
            let imgMenu = header.querySelector(".menu")
            let options = header.querySelector(".menu__options")
            let cross = header.querySelector(".cross")
            let singOut = header.querySelector(".singout")
            let data = header.querySelector(".data")
            imgIcon.addEventListener("click",e=>{
                Router.go("/home")
            })
            reportDataLink.addEventListener("click",e=>{
                Router.go("/petsreported")
            })
            reportPetLink.addEventListener("click",e=>{
                Router.go("/report")
            })
            data.addEventListener("click",(e)=>{
                Router.go("/misdatos")
            })
            singOut.addEventListener("click",e=>{
                state.clearLocalStorage()
                state.cleanUserData()
                Router.go("/")
            })
            cross.addEventListener("click",e=>{
                options.classList.toggle("menu__options_active")    
            })
            imgMenu.addEventListener("click",e=>{
                options.classList.toggle("menu__options_active")
            }) 
            this.shadow.appendChild(style)
            this.shadow.appendChild(header)
        }
}
customElements.define("header-custom",Header)