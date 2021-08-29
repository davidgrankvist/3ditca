import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

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

// create 3D grid of cubes
const dim = 100;
const numCubes = dim * dim * dim;
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x00bbaa , emissive: 0x0000aa });
const cubes = new THREE.InstancedMesh(geometry, material, numCubes);
const matrix = new THREE.Matrix4();

let i = 0;
for (let x = 0; x < dim; x++) {
    for (let y = 0; y < dim; y++) {
        for (let z = 0; z < dim; z++) {
            matrix.setPosition(x, y, z);
            cubes.setMatrixAt(i, matrix);
            i++;
        }
    }
}
scene.add(cubes);

// zoom out to see graphics
camera.position.set(dim * 2, dim * 2, dim * 2);
camera.lookAt(0, 0, 0);

// render loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();
