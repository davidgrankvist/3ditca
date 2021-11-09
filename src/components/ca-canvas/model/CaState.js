import GPU from "gpu.js";
import { ggolTransitionGgpu } from "./transitions.js";

export default class CaState {
    #grid; // cell states 3D vector
    #dimensions; // convenience object for grid dimensions

    // dims, revive limits and survive limits as shader-friendly arrays
    #dimsArr;
    #slimsArr;
    #rlimsArr;

    // ggpu objects
    #gpuCompute;
    #kernel;

    constructor(grid, slims, rlims) {
        this.#grid = grid;

        // format exposed in getter
        this.#dimensions = {
            z: this.#grid.length,
            y: this.#grid[0].length,
            x: this.#grid[0][0].length
        };

        // arguments for compute shader
        this.#dimsArr = [this.#dimensions.x, this.#dimensions.y, this.#dimensions.z];
        this.#slimsArr = [slims.min, slims.max];
        this.#rlimsArr = [rlims.min, rlims.max];

        // compute shader
        this.#gpuCompute = new GPU.GPU({ mode: "webgl2" });
        this.#kernel = this.#gpuCompute.createKernel(ggolTransitionGgpu).setOutput(this.#dimensions);
    }

    update() {
        this.#grid = this.#kernel(this.#grid, this.#dimsArr, this.#slimsArr, this.#rlimsArr);
        return true;
    }

    getState(x, y, z) {
        return this.#grid[z][y][x];
    }

    getDimensions() {
        return this.#dimensions;
    }
}
