import "./ca-param-form.js";

class CaTools extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ["visible"];
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="box">
                <ca-param-form></ca-param-form>
            </div>
        `;
        this.style = `
            position: absolute;
            right: 50%;
            top: 50%;
            transform: translate(50%, -50%);
            visibility: hidden;
            opacity: 0;
        `;
    }

    attributeChangedCallback(name, _, newValue) {
        if (name !== "visible") {
            return;
        }

        // remove defaults
        this.style.removeProperty("visibility");
        this.style.removeProperty("opacity");

        // choose fade effect
        if (newValue === "true") {
            this.classList.remove("ca-fade-out");
            this.classList.add("ca-fade-in");
        } else {
            this.classList.remove("ca-fade-in");
            this.classList.add("ca-fade-out");
        }
    }
}
customElements.define("ca-tools", CaTools);
