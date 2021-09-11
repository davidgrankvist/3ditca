import * as THREE from "three";
import { BinaryCell } from "../model/cellConstants.js";

export default class CaGraphics {
    #mesh; // combined mesh of all cells

    #cellTransform;

    #maxDims;
    #dims;

    constructor(maxDims) {
        this.#maxDims = maxDims;
        this.#dims = maxDims;

        // cell graphics
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial({ color: 0x00bbaa, emissive: 0x0000aa});

        // instancing
        const numCubes = this.#maxDims.x * this.#maxDims.y * this.#maxDims.z;
        this.#mesh = new THREE.InstancedMesh(geometry, material, numCubes);

        this.#cellTransform = new THREE.Matrix4();
    }

    getMesh() {
        return this.#mesh;
    }

    #updateCell(x, y, z, i, prevCellState) {
        switch (prevCellState) {
            case BinaryCell.ON:
                this.#cellTransform.setPosition(
                    x - Math.round(this.#dims.x / 2),
                    y - Math.round(this.#dims.y / 2),
                    z - Math.round(this.#dims.z / 2)
                );
                this.#mesh.setMatrixAt(i, this.#cellTransform);
                break;
            default:
        }
    }

    // subscription
    update(caState) {
        const dims = caState.getDimensions();
        if (dims.x > this.#maxDims.x ||
            dims.y > this.#maxDims.y ||
            dims.z > this.#maxDims.z) {
            throw new Error("CA state dimensions out of bounds.");
        } else if (dims.x !== this.#dims.x ||
            dims.y !== this.#dims.y ||
            dims.z !== this.#dims.z) {
            this.#dims = dims;
        }

        let i = 0;
        for (let x = 0; x < dims.x; x++) {
            for (let y = 0; y < dims.y; y++) {
                for (let z = 0; z < dims.z; z++) {
                    const nextCellState = caState.getState(x, y, z);
                    // only need instances for visible cells
                    if (nextCellState !== BinaryCell.OFF) {
                        this.#updateCell(x, y, z, i, nextCellState);
                        i++;
                    }
                }
            }
        }
        this.#mesh.instanceMatrix.needsUpdate = true;
        this.#mesh.count = i;
    }
}
