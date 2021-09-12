import CaController from "./control/CaController.js";

class CaCanvas extends HTMLElement {
    #container;
    #controller;

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
        this.addEventListener("ca-config", (e) => {
            const config = e.detail;
            if (!this.#controller.hasStarted()) {
                this.#controller.init(this.#container, config);
            }
            this.#controller.configure(config);
        });
    }
}
customElements.define("ca-canvas", CaCanvas);
