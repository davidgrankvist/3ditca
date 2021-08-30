import { THREE, OrbitControls } from "./three.js";
import CaState from "./model/CaState.js";
import { ggolTransition } from "./model/transitions.js";
import { BinaryCell } from "./model/cellConstants.js";
import CaGraphics from "./CaGraphics.js";
import { init3dArr } from "./arrayUtils.js";

// init
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// light source
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(200, 400, 300);
scene.add(spotLight);

// init cell states and transition
const dim = 50;
const randomize = () => Math.random() > 0.5 ? BinaryCell.OFF : BinaryCell.ON;
const randomGrid = init3dArr({x: dim, y: dim, z: dim}, randomize);
const mn = 26;
const surviveLimits = { min: mn * 0.1, max: mn * 0.375 };
const reviveLimits = { min: mn * 0.375, max: mn * 0.375 };
const transition = (x, y, z, state) =>
    ggolTransition(x, y, z, state, surviveLimits, reviveLimits);
const caState = new CaState(randomGrid, transition);

// init cell graphics
const caGraphics = new CaGraphics(caState);
caGraphics.update();
scene.add(caGraphics.getMesh());

// init camera
const orbitControls = new OrbitControls(camera, renderer.domElement);
const cameraDistance = dim;
camera.position.set(cameraDistance, cameraDistance, cameraDistance);
camera.lookAt(0, 0, 0);
orbitControls.update();

renderer.render(scene, camera);

// render loop
let hasConverged = false;
const animate = () => {
    requestAnimationFrame(animate);
    if(!hasConverged && caState.update()) {
        caGraphics.update();
    } else if (!hasConverged) {
        console.log("The CA has converged. Skipping furher updates of state and graphics.");
        hasConverged = true;
    }
    orbitControls.update();
    renderer.render(scene, camera);
};
animate();
