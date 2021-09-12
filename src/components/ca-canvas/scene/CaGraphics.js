import * as THREE from "three";
import { BinaryCell } from "../model/cellConstants.js";

export default class CaGraphics {
    #mesh; // combined mesh of all cells
    #geometry;
    #material;

    #cellTransform;

    #maxDims;
    #dims;

    constructor(config) {
        this.#maxDims = config.dims;
        this.#dims = this.#maxDims;

        // cell graphics
        this.#geometry = new THREE.BoxGeometry();
        this.#material = new THREE.MeshLambertMaterial({ color: 0x00bbaa, emissive: 0x0000aa});

        const numCubes = this.#maxDims.x * this.#maxDims.y * this.#maxDims.z;
        this.#mesh = new THREE.InstancedMesh(this.#geometry, this.#material, numCubes);

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

    configureMesh(config, scene) {
        // re-create mesh if the total number of instances is too low
        if (scene && this.#shouldScaleCapacity(config)) {
            scene.remove(this.#mesh);
            this.#mesh?.dispose();
            const dims = config.dims;
            const numCubes = dims.x * dims.y * dims.z;
            this.#mesh = new THREE.InstancedMesh(this.#geometry, this.#material, numCubes);
            scene.add(this.#mesh);
        }
        this.#maxDims = config.dims;
    }

    #shouldScaleCapacity(config) {
        const numCubes = this.#maxDims.x * this.#maxDims.y * this.#maxDims.z;
        const numCubesNext = config.dims.x * config.dims.y * config.dims.z;
        return numCubes < numCubesNext;
    }
}
