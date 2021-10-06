import GpuCompute from "../GpuCompute.js";
import { ggolTransitionShader } from "../model/computeShaders.js";

// TODO: need to garbage collect gpu compute mesh if state is resized
export default class CaState {
    #gpuCompute;
    #dimensions;
    #hasComputed = false;

    constructor(config, initFunction, renderer) {
        const dims = config.dims;
        this.#dimensions = dims;
        const survLims = config.transition.args.surviveLimits;
        const revLims = config.transition.args.reviveLimits;

        const size = dims.x * dims.y * dims.z;
        const data = new Array(size * 4) // 4 for rgba
            .fill(null).map(x => initFunction(x));
        const uniforms = {
            dims: { value: new Float32Array([dims.x, dims.y, dims.z, 1.0]) },
            lims: { value: new Float32Array(
                [survLims.min, survLims.max, revLims.min, revLims.max]
            ) }
        };

        this.#gpuCompute = new GpuCompute(renderer, data, ggolTransitionShader, uniforms);
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
