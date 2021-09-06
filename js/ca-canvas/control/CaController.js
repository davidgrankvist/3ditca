import { initCa } from "../model/init.js";
import World from "../scene/World.js";
import RenderLoop from "./RenderLoop.js";
import Publisher from "./Publisher.js";

export default class CaController {
    #world;
    #publisher;
    #loop;

    #play = true;

    init(container) {
        const mn = 26;
        const config = {
            dims: {
                x: 50,
                y: 50,
                z: 50
            },
            initCell: {
                type: "random",
                args: { r: 0.5 }
            },
            transition: {
                type: "ggol",
                args: {
                    surviveLimits: {
                        min: mn * 0.1,
                        max: mn * 0.375
                    },
                    reviveLimits: {
                        min: mn * 0.375,
                        max: mn * 0.375,
                    }
                }
            }
        };
        // init graphics
        this.#world = new World(container);
        this.#world.init(config.dims);

        const caState = initCa(config);

        // subcribe to model
        this.#publisher = new Publisher(caState);
        this.#publisher.addSubscriber(this.#world);

        // render
        this.#loop = new RenderLoop(() => {
            if (this.#play) {
                this.#publisher.update();
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
}
