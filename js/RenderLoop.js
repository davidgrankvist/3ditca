export default class RenderLoop {
    #world;
    #play = true;

    constructor(world) {
        this.#world = world;
    }

    play() {
        this.#play = true;
    }

    pause() {
        this.#play = false;
    }

    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            if (this.#play) {
                this.#world.update();
            }
            // camera requires rendering
            this.#world.render();
        };
        animate();
    }
}
