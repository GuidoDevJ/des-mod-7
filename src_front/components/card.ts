import "./button"
import {state as estado} from "../state"
import  Swal from "sweetalert2"

export class CardPet extends HTMLElement{
    shadow= this.attachShadow({"mode":"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let localStorageData = JSON.parse(localStorage.getItem("dataUser"))
        const cs = estado.getUserData();
        let csName = cs.name || localStorageData.name
        let img = this.getAttribute("img")
        let namePet = this.getAttribute("name")
        let state = this.getAttribute("state")
        let email = this.getAttribute("email")
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
            .report{
                width:122px;
                margin-right:10px;
                display:flex;
                justify-content:center;
                align-items:center;
            }
            .report a{
                font-size:16px;
            }
            .datareported{
                display:none;
            }
            .datareported__active{
                display:flex;
                position:absolute;
                top:0;
                right:0;
                left:0;
                bottom:0;
                background-color:rgba(252, 234, 233, 0.41);
                align-items:center;
                justify-content:center;
            }
            .form{
                width:90%;
                height:90%;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                padding:10px;
                background-color:#fff;
            }
            .form__close{
                height:20px;
                align-self:flex-end;
                cursor:pointer;
            }
            .form div{
                display:flex;
                flex-direction:column;
            }
            .form div input{
                height:50px;
                border-radius:4px;
                font-size:24px;
            }
            .form div textarea{
                resize:none;
                font-size:1rem;
                height:200px;
            }
            .btn__container{
                width:100%;
                display:flex;
                justify-content:center;
                align-items:center;

            }
        `

        div.innerHTML =`
            <div class="image">
                <img src=${img}>
            </div>
            <div class="data">
                <div class="names">
                    <h2>${namePet}</h2>
                </div>
                <div class="report">
                    <a href="#" class="report__link">Reportar Informacion</a>
                </div>
            </div>
            <div class="datareported">
                
                <form class="form">
                    <div class="form__close">
                        <span class="cross">X</span>
                    </div>
                    <h1>Reportar Informacion de ${namePet}</h1>
                    <div>
                        <label for="name">Tu Nombre</label>
                        <input type="text" value=${csName}>
                    </div>
                    <div>
                        <label for="telefono">Tu Telefono</label>
                        <input type="text" class="phone">
                    </div>
                    <div>
                        <label for="description">
                            Donde lo viste?
                        </label>
                        <textarea class="acerca"></textarea>
                    </div>
                    <div class="btn__container">
                        <btn-custom text="Enviar" class="send"></btn-custom>
                    </div>
                </form>
            </div>
        `
        let linkReported = div.querySelector(".report__link")
        let dataForm = div.querySelector(".datareported")
        let btnCloseForm = div.querySelector(".form__close")
        let $send = div.querySelector(".send")
        let $phone = div.querySelector(".phone") as any
        let $data = div.querySelector(".acerca") as any
        $send.addEventListener("click",async(e)=>{
            e.preventDefault()
            let datosSend = {
                to:email,
                petName:namePet,
                fullName:csName,
                phone:$phone.value,
                data:$data.value

            }

            let resul = await estado.sendEmail(datosSend)
            if(resul){
                Swal.fire({
                    icon:"success",
                    title:"Mensaje",
                    html:`Muy bien ${localStorageData.name} el mensaje fue enviado`,
                    timer:1000
                })
                dataForm.classList.toggle("datareported__active")


            }
        })
        btnCloseForm.addEventListener("click",e=>{
            dataForm.classList.toggle("datareported__active")
        })
        linkReported.addEventListener("click",e=>{
            dataForm.classList.toggle("datareported__active")
        })
        this.shadow.appendChild(style)
        this.shadow.appendChild(div)
    }
}

customElements.define("card-custom",CardPet)