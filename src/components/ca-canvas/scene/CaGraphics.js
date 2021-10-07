import * as THREE from "three";

export default class CaGraphics {
    #mesh; // combined mesh of all cells
    #geometry;
    #material;

    #maxDims;
    #dims;

    #uniforms;

    constructor(config, renderer) {
        const dims = config.dims;
        this.#maxDims = dims;

        const size = dims.x * dims.y * dims.z;
        const gl = renderer.getContext();
        const resCap = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        let res;
        if (size <= resCap) {
            res = { x: size, y: 1 };
        } else {
            res = { x: resCap, y: Math.ceil(size / resCap) };
        }

        this.#uniforms = {
            data: { value: null },
            dims: { value: new Float32Array([dims.x, dims.y, dims.z, 1.0]) },
            res: { value: new Float32Array([res.x, res.y]) }
        };

        this.#geometry = new THREE.BoxGeometry();
        this.#material = new THREE.ShaderMaterial({
            uniforms: this.#uniforms,
            vertexShader: `
                uniform sampler2D data;
                uniform vec4 dims;
                uniform vec2 res;

                void main() {
                    /*
                     * here's the idea:
                     *
                     * if state is 1, use gl_InstanceID and max dims here to figure out position
                     *  otherwise, put at some hidden position
                     *
                     * also, a mod b = a - (b * floor(a / b))
                     */

                    float xm = dims.x;
                    float ym = dims.y;
                    float zm = dims.z;
                    float size = xm * ym * zm;
                    float id = float(gl_InstanceID);
                    vec4 newPos = vec4(position, 1.0); //origin

                    // index in one dimensional array
                    float index = id;
                    vec2 resolution = res;
                    // corresponding texel position that wraps the 1D array
                    vec2 tp;
                    if (index <= resolution.x) {
                        tp.x = index;
                        tp.y = 1.0;
                    } else {
                        // index mod res x
                        tp.x = index - (resolution.x * floor( index / resolution.x));
                        tp.y = ceil(index / resolution.x);
                    }

                    vec4 cell_state = texture(data, tp / resolution.xy);
                    float cell_state_f = cell_state.r;

                    // x = id mod xm
                    newPos.x += id - (xm * floor(id / xm));
                    // y = (id / xm) mod ym
                    newPos.y += floor(id / xm) - (ym * floor(floor(id / xm) / ym));
                    // z = (id / ((xm + 1)(ym + 1))) mod zm
                    float a = floor(id / ((xm + 1.0) * (ym + 1.0)));
                    newPos.z += a - (zm * floor(a / zm));

                    // collapse in (0, 0, 0) if state is zero
                    newPos.x *= cell_state_f;
                    newPos.y *= cell_state_f;
                    newPos.z *= cell_state_f;

                    gl_Position = projectionMatrix * modelViewMatrix * newPos;
                }
            `,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }
            `
        });
        const numCubes = this.#maxDims.x * this.#maxDims.y * this.#maxDims.z;
        this.#mesh = new THREE.InstancedMesh(this.#geometry, this.#material, numCubes);
    }

    getMesh() {
        return this.#mesh;
    }

    // subscription
    update(caState) {
        this.#uniforms.data.value = caState.getState();
    }

    configureMesh(config, scene) {
        /*
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
        */
    }

    #shouldScaleCapacity(config) {
        /*
        const numCubes = this.#maxDims.x * this.#maxDims.y * this.#maxDims.z;
        const numCubesNext = config.dims.x * config.dims.y * config.dims.z;
        return numCubes < numCubesNext;
        */
        return false;
    }
}
