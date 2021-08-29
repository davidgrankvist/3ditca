import { THREE } from "./three.js";

const HIDDEN = 0;
const SHOWN = 1;

export default class CaGraphics {
    #state; // CaState
    #mesh; // combined mesh of all cells

    /*
     * InstancedMesh does not expose the visibility
     * of instances. To work around this, instances are
     * hidden by collapsing them into a point.
     */
    #matrixHide;
    #matrixShow;

    constructor(state) {
        this.#state = state;

        // cell graphics
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial({ color: 0x00bbaa, emissive: 0x0000aa});

        // instancing
        const dims = this.#state.getDimensions();
        const numCubes = dims.x * dims.y * dims.z;
        this.#mesh = new THREE.InstancedMesh(geometry, material, numCubes);

        // cell transforms
        this.#matrixShow = new THREE.Matrix4();
        this.#matrixHide = new THREE.Matrix4();
        this.#matrixHide.set(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        );
    }

    getMesh() {
        return this.#mesh;
    }

    #updateCell(x, y, z, i) {
        switch (this.#state.getState(x, y, z)) {
            case HIDDEN:
                this.#mesh.setMatrixAt(i, this.#matrixHide);
                break;
            case SHOWN:
                this.#matrixShow.setPosition(x, y, z);
                this.#mesh.setMatrixAt(i, this.#matrixShow);
                break;
            default:
                console.warn("Unsupported cell state ", this.#state.getState(x, y, z));
        }
    }

    update() {
        let i = 0;
        const dims = this.#state.getDimensions();
        for (let x = 0; x < dims.x; x++) {
            for (let y = 0; y < dims.y; y++) {
                for (let z = 0; z < dims.z; z++) {
                    this.#updateCell(x, y, z, i);
                    i++;
                }
            }
        }
        this.#mesh.instanceMatrix.needsUpdate = true;
    }
}
