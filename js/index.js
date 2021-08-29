import { THREE } from "./three.js";
import CaState from "./CaState.js";
import CaGraphics from "./CaGraphics.js";
import { init3dArr }from "./arrayUtils.js";

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
const dim = 100;
const randomize = () => Math.random() > 0.5 ? 0 : 1;
const randomGrid = init3dArr({x: dim, y: dim, z: dim}, randomize);
const randomTransition = (x, y, z, state) => randomize();
const caState = new CaState(randomGrid, randomTransition);

// init cell graphics
const caGraphics = new CaGraphics(caState);
caGraphics.update();
scene.add(caGraphics.getMesh());

// zoom out to see graphics
const cameraDistance = dim * 2;
camera.position.set(cameraDistance, cameraDistance, cameraDistance);
camera.lookAt(0, 0, 0);

renderer.render(scene, camera);

// render loop
const animate = () => {
    requestAnimationFrame(animate);
    caState.update();
    caGraphics.update();
    renderer.render(scene, camera);
};
animate();
