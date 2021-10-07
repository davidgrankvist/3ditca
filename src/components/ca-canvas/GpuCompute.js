import * as THREE from "three";

const defaultFragmentShader = `
uniform sampler2D data;
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture(data, uv);
}
`;

const initRenderTarget = (res) =>
    new THREE.WebGLRenderTarget(
        res.x,
        res.y,
        {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            stencilBuffer: false,
        }
    );

export default class GpuCompute {
    #inputUniforms;
    // alter render targets to prevent having the same input and output texture
    #prevRenderTarget;
    #nextRenderTarget;

    // needed for rendering
    #renderer;
    #scene;
    #camera;

    constructor(renderer, data, res, computeFragmentShader = defaultFragmentShader, uniforms = {}) {
        // shader input is passed as a texture via a uniform
        const rgbaData = new Float32Array(data);
        const dataTexture = new THREE.DataTexture(
            rgbaData,
            res.x,
            res.y,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        dataTexture.needsUpdate = true;
        this.#inputUniforms = {
            data: { value: dataTexture },
            ...uniforms
        };

        // shader output is collected from the texture of a render target
        this.#prevRenderTarget = initRenderTarget(res);
        this.#nextRenderTarget = initRenderTarget(res);

        // material that defines shaders and uniforms
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.#inputUniforms,
            // the vertex shader is not used in the computation
            vertexShader: `
                void main() {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: computeFragmentShader
        });
        shaderMaterial.defines.resolution = `vec2(${res.x}, ${res.y})`;

        // other objects that are required for rendering
        this.#renderer = renderer;
        this.#scene = new THREE.Scene();
        this.#camera = new THREE.Camera();
        this.#camera.position.z = 1;
        const mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2, 2),
            shaderMaterial
        );
        this.#scene.add(mesh);
    }

    getInputTexture() {
        return this.#inputUniforms.data.value;
    }


    setInputTexture(texture) {
        this.#inputUniforms.data.value = texture;
    }

    compute() {
        this.#renderer.setRenderTarget(this.#nextRenderTarget);
        this.#renderer.render(this.#scene, this.#camera);
        this.#renderer.setRenderTarget(null);

        const tmp = this.#prevRenderTarget;
        this.#prevRenderTarget = this.#nextRenderTarget;
        this.#nextRenderTarget = tmp;
    }

    getOutputTexture() {
        return this.#prevRenderTarget.texture;
    }
}
