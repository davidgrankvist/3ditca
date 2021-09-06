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
        this.addEventListener("ca-init", (e) => this.#controller.init(this.#container, e.detail));
        this.addEventListener("ca-play", () => this.#controller.play());
        this.addEventListener("ca-pause", () => this.#controller.pause());
        this.addEventListener("ca-config", (e) => this.#controller.configure(e.detail));
    }

    attributeChangedCallback(name, _, newValue) {
        this.#container.setAttribute(name, newValue);
    }
}
customElements.define("ca-canvas", CaCanvas);
