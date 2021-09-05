import CaController from "./control/CaController.js";

class CaCanvas extends HTMLElement {
    #container;
    #controller;

    static get observedAttributes() {
        return ["width", "height"];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: "closed"});
        this.#container = document.createElement("div");
        shadow.appendChild(this.#container);

        this.#controller = new CaController();
        this.addEventListener("ca-init", () => this.#controller.init(this.#container));
    }

    attributeChangedCallback(name, _, newValue) {
        this.#container.setAttribute(name, newValue);
    }
}
customElements.define("ca-canvas", CaCanvas);
