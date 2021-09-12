import { initCa } from "../model/init.js";
import World from "../scene/World.js";
import RenderLoop from "./RenderLoop.js";
import Publisher from "./Publisher.js";

export default class CaController {
    #world;
    #publisher;
    #loop;

    #hasStarted = false;
    #play = false;

    init(container, config) {
        // init graphics
        this.#world = new World(container);
        this.#world.init(config);

        // render
        this.#loop = new RenderLoop(() => {
            if (this.#play) {
                this.#publisher?.update();
            }
            this.#world.render();
        });
        this.#loop.start();
        this.#hasStarted = true;
    }

    play() {
        this.#play = true;
    }

    pause() {
        this.#play = false;
    }

    configure(config) {
        // world capacity
        this.#world.configure(config);

        // CA state
        const caState = initCa(config);
        this.#publisher = new Publisher(caState);
        this.#publisher.addSubscriber(this.#world);

        // camera
        const dims = config.dims;
        this.#world.setCameraPosition(dims.x, dims.y, dims.z);
    }

    hasStarted() {
        return this.#hasStarted;
    }
}
