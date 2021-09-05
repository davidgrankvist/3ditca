import CaState from "../model/CaState.js";
import World from "../scene/World.js";
import { ggolTransition } from "../model/transitions.js";
import { init3dArr } from "../arrayUtils.js";
import { BinaryCell } from "../model/cellConstants.js";
import RenderLoop from "./RenderLoop.js";
import Publisher from "./Publisher.js";

export default class CaController {
    #world;
    #publisher;
    #loop;

    init(container) {
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
        this.#world = new World(container);
        this.#world.init(dims);

        // subcribe to model
        this.#publisher = new Publisher(new CaState(randomGrid, transition));
        this.#publisher.addSubscriber(this.#world);

        // render
        this.#loop = new RenderLoop(() => {
            this.#publisher.update();
            this.#world.render();
        });
        this.#loop.start()
    }
}
