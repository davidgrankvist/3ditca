import { THREE, OrbitControls } from "../three.js";
import CaGraphics from "./CaGraphics.js";

export default class World {
    #container;

    #scene;
    #camera;
    #renderer;
    #orbitControls;
    #spotLight;

    #caGraphics;

    constructor(container) {
        this.#container = container;
    }

    init(dims) {
        const width = parseInt(this.#container.getAttribute("width"));
        const height = parseInt(this.#container.getAttribute("height"));
        // essentials
        this.#scene = new THREE.Scene();
        this.#camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.#renderer = new THREE.WebGLRenderer();
        this.#renderer.setSize(width, height);
        this.#container.appendChild(this.#renderer.domElement);

        // light source
        this.#spotLight = new THREE.SpotLight(0xffffff);
        this.#spotLight.position.set(200, 400, 300);
        this.#scene.add(this.#spotLight);

        // CA
        this.#caGraphics = new CaGraphics(dims);
        this.#scene.add(this.#caGraphics.getMesh());

        // camera
        this.#orbitControls = new OrbitControls(this.#camera, this.#renderer.domElement);
        this.#camera.position.set(dims.x, dims.y, dims.z);
        this.#orbitControls.update();

        // initial render
        this.#renderer.render(this.#scene, this.#camera);
    }

    // subscription
    update(caState) {
        this.#caGraphics.update(caState);
    }

    render() {
        this.#orbitControls.update();
        this.#renderer.render(this.#scene, this.#camera);
    }
}
