export class Button extends HTMLElement{
    shadow=this.attachShadow({"mode":"open"})
    constructor(){
        super()
        this.render()
    }
    render(){
        let btn= document.createElement("button")
        let text = this.getAttribute("text")
        let color = this.getAttribute("color")
        btn.classList.add("btn")
        let style = document.createElement("style")
        style.innerHTML = `
            .btn{
                width:335px;
                height:50px;
                border-radius:4px;
                background-color:${color};
                font-size:16px;
                font-weight:700;
                border:none;
            }
        `
        btn.innerHTML = text

        this.shadow.appendChild(style)
        this.shadow.appendChild(btn)
    }
}
customElements.define("btn-custom",Button)