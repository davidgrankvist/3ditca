import { THREE, OrbitControls } from "./three.js";
import CaGraphics from "./CaGraphics.js";

export default class World {
    #scene;
    #camera;
    #renderer;
    #orbitControls;
    #spotLight;

    #caState;
    #caGraphics;

    #hasConverged = false;

    constructor(caState) {
        this.#caState = caState;
    }

    init() {
        // essentials
        this.#scene = new THREE.Scene();
        this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.#renderer = new THREE.WebGLRenderer();
        this.#renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.#renderer.domElement);

        // light source
        this.#spotLight = new THREE.SpotLight(0xffffff);
        this.#spotLight.position.set(200, 400, 300);
        this.#scene.add(this.#spotLight);

        this.#caGraphics = new CaGraphics(this.#caState);
        this.#caGraphics.update();
        this.#scene.add(this.#caGraphics.getMesh());

        this.#orbitControls = new OrbitControls(this.#camera, this.#renderer.domElement);
        const dims = this.#caState.getDimensions();
        this.#camera.position.set(dims.x, dims.y, dims.z);
        // camera.lookAt(0, 0, 0);
        this.#orbitControls.update();

        this.#renderer.render(this.#scene, this.#camera);
    }

    update() {
        if(!this.#hasConverged && this.#caState.update()) {
            this.#caGraphics.update();
        } else if (!this.#hasConverged) {
            console.log("The CA has converged. Skipping furher updates of state and graphics.");
            this.#hasConverged = true;
        }
    }

    render() {
        this.#orbitControls.update();
        this.#renderer.render(this.#scene, this.#camera);
    }
}
