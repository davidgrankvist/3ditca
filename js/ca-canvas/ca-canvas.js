import CaState from "./model/CaState.js";
import World from "./scene/World.js";
import RenderLoop from "./RenderLoop.js";
import { ggolTransition } from "./model/transitions.js";
import { init3dArr } from "./arrayUtils.js";
import { BinaryCell } from "./model/cellConstants.js";
import Publisher from "./Publisher.js";

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
        // init model
        const dim = 50;
        const dims = {
            x: dim,
            y: dim,
            z: dim
        };
        const randomize = () => Math.random() > 0.5 ? BinaryCell.OFF : BinaryCell.ON;
        const randomGrid = init3dArr(dims, randomize);
        const mn = 26;
        const surviveLimits = { min: mn * 0.1, max: mn * 0.375 };
        const reviveLimits = { min: mn * 0.375, max: mn * 0.375 };
        const transition = (x, y, z, state) =>
            ggolTransition(x, y, z, state, surviveLimits, reviveLimits);

        // init graphics
        const world = new World(this.#container);
        world.init(dims);

        // subcribe to model
        const caStatePublisher = new Publisher(new CaState(randomGrid, transition));
        caStatePublisher.addSubscriber(world);

        // render
        const loop = new RenderLoop(() => {
            caStatePublisher.update();
            world.render();
        });
        loop.start()
    }
}
customElements.define("ca-canvas", CaCanvas);
