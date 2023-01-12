import { Router } from "@vaadin/router"
import { state } from "../state"

let pen = require("url:../assets/pen.png")
export class CardEdit extends HTMLElement{
    shadow= this.attachShadow({"mode":"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let stateBoolean;
        let idPet = this.getAttribute("petId")
        let img = this.getAttribute("img")
        let namePet = this.getAttribute("name")
        let lat = this.getAttribute("lat")
        let lng = this.getAttribute("lng")
        let statePet = this.getAttribute("state")
        let div = document.createElement("div")
        div.classList.add("container")
        let style = document.createElement("style")

        style.innerHTML = `
            .container{
                display:grid;
                grid-template-rows: repeat(2,1fr);
                width:335px;
                height:234px;
                border:1px solid black;
            }
            .image{
                width: 100%;
                height:147px;
                background-color:red;
            }
            .image img{
                width:100%;
                height:100%;
                object-fit:cover;
            }
            .data{
                display:flex;
                justify-content:space-between;
            }
            .names{
                margin-left:10px;
            }
            .data h2{
                margin-top:0px;
                margin-bottom:0px;
                font-size:40px;
                font-weight:bold;
            }
            .data h3{
                font-size:16px;
                font-weight:500;
            }
            .edit{
                width:122px;
                margin-right:10px;
                display:flex;
                justify-content:flex-end;
                align-items:center;
            }
            .edit a{
                font-size:16px;
            }
        `

        div.innerHTML =`
            <div class="image">
                <img src=${img} >
            </div>
            <div class="data">
                <div class="names">
                    <h2>${namePet}</h2>
                </div>
                <div class="edit">
                    <a href="#" class="edit__link">
                        <img src=${pen} class="pen">
                    </a>
                </div>
            </div>
        `
            let linkEdit = div.querySelector(".pen")
            linkEdit.addEventListener("click",(e)=>{
                if(statePet === "true"){
                    stateBoolean=true
                }else{
                    stateBoolean = false
                }
                const petData = {
                    petName : namePet,
                    img,
                    lat,
                    lng,
                    petId : idPet,
                    state:stateBoolean
                }
                state.setReportPet(petData)
                Router.go("/editpet")
            })

        this.shadow.appendChild(style)
        this.shadow.appendChild(div)
    }
}

customElements.define("cardedit-custom",CardEdit)