import CaController from "./control/CaController.js";

class CaCanvas extends HTMLElement {
    #container;
    #controller;

    static get observedAttributes() {
        return ["max-x", "max-y", "max-z"];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: "closed"});
        this.#container = document.createElement("div");
        this.#container.style = `
            height: 100%;
            width: 100%;
        `;
        shadow.appendChild(this.#container);

        this.#controller = new CaController();
        this.addEventListener("ca-play", () => this.#controller.play());
        this.addEventListener("ca-pause", () => this.#controller.pause());
        this.addEventListener("ca-config", (e) => this.#controller.configure(e.detail));
    }

    attributeChangedCallback(name, _, newValue) {
        this.#container.setAttribute(name, newValue);
    }

    connectedCallback() {
        this.#controller.init(this.#container);
    }
}
customElements.define("ca-canvas", CaCanvas);
