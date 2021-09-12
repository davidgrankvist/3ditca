import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
        const resizeObserver = new ResizeObserver(entries => {
            const bbSize = entries[0].borderBoxSize[0];
            const width = bbSize.inlineSize;
            const height = bbSize.blockSize;
            this.resize(width, height);
        });
        resizeObserver.observe(this.#container);
    }

    init(config) {
        const style = getComputedStyle(this.#container);
        const width = parseInt(style.width);
        const height = parseInt(style.height);

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
        this.#caGraphics = new CaGraphics(config);
        this.#scene.add(this.#caGraphics.getMesh());

        // camera
        this.#orbitControls = new OrbitControls(this.#camera, this.#renderer.domElement);
        const dims = config.dims;
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

    setCameraPosition(x, y, z) {
        this.#camera.position.set(x, y, z);
    }

    resize(width, height) {
        if(!this.#renderer) {
            return;
        }
        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(width, height);
    }

    configure(config) {
        this.#caGraphics.configureMesh(config, this.#scene);
    }
}
