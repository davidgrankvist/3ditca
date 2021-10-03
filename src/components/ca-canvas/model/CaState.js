import GpuCompute from "../GpuCompute.js";
import { ggolTransitionShader } from "../model/computeShaders.js";

// TODO: need to garbage collect gpu compute mesh if state is resized
export default class CaState {
    #gpuCompute;
    #dimensions;
    #hasComputed = false;

    constructor(dims, initFunction, renderer) {
        this.#dimensions = dims;

        const size = dims.x * dims.y * dims.z;
        const data = new Array(size * 4) // 4 for rgba
            .fill(null).map(x => initFunction(x));
        this.#gpuCompute = new GpuCompute(renderer, data, ggolTransitionShader);
    }

    update() {
        this.#gpuCompute.compute();
        const dataTexture = this.#gpuCompute.getOutputTexture();
        this.#gpuCompute.setInputTexture(dataTexture);

        this.#hasComputed = true;
    }

    getState() {
        if (!this.#hasComputed) {
            return this.#gpuCompute.getInputTexture();
        }
        return this.#gpuCompute.getOutputTexture();
    }

    getDimensions() {
        return this.#dimensions;
    }
}
