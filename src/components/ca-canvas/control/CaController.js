import { initCa } from "../model/init.js";
import World from "../scene/World.js";
import RenderLoop from "./RenderLoop.js";
import Publisher from "./Publisher.js";

export default class CaController {
    #world;
    #publisher;
    #loop;

    #play = false;

    init(container) {
        // init graphics
        this.#world = new World(container);
        this.#world.init();

        // render
        this.#loop = new RenderLoop(() => {
            if (this.#play) {
                this.#publisher?.update();
            }
            this.#world.render();
        });
        this.#loop.start()
    }

    play() {
        this.#play = true;
    }

    pause() {
        this.#play = false;
    }

    configure(config) {
        const caState = initCa(config);
        this.#publisher = new Publisher(caState);
        this.#publisher.addSubscriber(this.#world);
        this.#world.setCameraPosition(config.dims.x, config.dims.y, config.dims.z);
    }
}
