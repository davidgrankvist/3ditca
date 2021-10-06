import * as THREE from "three";

const defaultFragmentShader = `
uniform sampler2D data;
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture(data, uv);
}
`;

const initRenderTarget = (textureSize) =>
    new THREE.WebGLRenderTarget(
        textureSize,
        1,
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

    constructor(renderer, data, computeFragmentShader = defaultFragmentShader, uniforms = {}) {
        const textureSize = data.length / 4;
        // shader input is passed as a texture via a uniform
        const rgbaData = new Float32Array(data);
        const dataTexture = new THREE.DataTexture(
            rgbaData,
            textureSize,
            1,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        dataTexture.needsUpdate = true;
        this.#inputUniforms = {
            data: { value: dataTexture },
            ...uniforms
        };

        // shader output is collected from the texture of a render target
        this.#prevRenderTarget = initRenderTarget(textureSize);
        this.#nextRenderTarget = initRenderTarget(textureSize);

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
        shaderMaterial.defines.resolution = `vec2(${textureSize}, 1)`;

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
