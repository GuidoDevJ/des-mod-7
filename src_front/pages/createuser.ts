import { Router } from '@vaadin/router';
import { state } from '../state';
export class Create extends HTMLElement{
    shadow = this.attachShadow({mode: 'open'}); 
    constructor(){
        super()
        this.render()
    }
    render(){
        const userImg = require("url:../assets/user.png")
        let div = document.createElement("div")
        div.classList.add("container")
        let style = document.createElement("style")
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
                height:70%;
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
            .form__btncreate{
                font-size:2em;
                width:70%;
                height:50px;
                border-radius:3px;
                color:#fff;
                background-color:#FED51B;
            }
            
        `
        div.innerHTML = `
            <form class="form">
                <div class="form__img">
                    <img src="${userImg}">
                </div>
                <div class="inputs">
                    <input type="text" placeholder="name" class="name">
                    <input type="email" placeholder="email" class="email">
                    <input type="password" placeholder="password" class="password">
                </div>
                <div class="btn">
                <button class="form__btncreate">Crear</button>
                </div>
                </form>
                
        `
        let form = div.querySelector(".form")
        let $name = div.querySelector(".name") as any
        let $email = div.querySelector(".email") as any
        let $password = div.querySelector(".password") as any
        form.addEventListener("submit", async(e)=>{
            try {
                e.preventDefault()
            const name = $name.value
            const email = $email.value
            const password = $password.value 
            await state.createUser(email,name,password)
            await state.authUser(email,password)
            Router.go("/home")
            } catch (error) {
                console.log(error)
            }
           
        })
        
        this.shadow.appendChild(style)
        this.shadow.appendChild(div)
    }
}
customElements.define("create-page",Create)