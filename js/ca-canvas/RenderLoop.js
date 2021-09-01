export default class RenderLoop {
    #callback

    constructor(callback) {
        this.#callback = callback;
    }

    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.#callback();
        };
        animate();
    }
}
