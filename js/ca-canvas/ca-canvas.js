import CaState from "./model/CaState.js";
import World from "./scene/World.js";
import RenderLoop from "./scene/RenderLoop.js";
import { ggolTransition } from "./model/transitions.js";
import { init3dArr } from "./arrayUtils.js";
import { BinaryCell } from "./model/cellConstants.js";

class CaCanvas extends HTMLElement {
    #container;

    static get observedAttributes() {
        return ["width", "height"];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: "closed"});
        this.#container = document.createElement("div");
        shadow.appendChild(this.#container);

        this.addEventListener("ca-init", this.onInit);
    }

    attributeChangedCallback(name, _, newValue) {
        this.#container.setAttribute(name, newValue);
    }

    onInit() {
        // init cell states and transition
        const dim = 50;
        const randomize = () => Math.random() > 0.5 ? BinaryCell.OFF : BinaryCell.ON;
        const randomGrid = init3dArr({x: dim, y: dim, z: dim}, randomize);
        const mn = 26;
        const surviveLimits = { min: mn * 0.1, max: mn * 0.375 };
        const reviveLimits = { min: mn * 0.375, max: mn * 0.375 };
        const transition = (x, y, z, state) =>
            ggolTransition(x, y, z, state, surviveLimits, reviveLimits);
        const caState = new CaState(randomGrid, transition);

        // create graphics and start rendering
        const world = new World(caState, this.#container);
        world.init();
        const loop = new RenderLoop(world);
        loop.start()
    }
}
customElements.define("ca-canvas", CaCanvas);
