import * as THREE from "three";

// TODO: implement some computation here
const defaultFragmentShader = `
uniform sampler2D u_texture;
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture(u_texture, uv);
}
`;

export default class GpuCompute {
    #inputUniforms;
    #outputRenderTarget;

    // needed for rendering
    #renderer;
    #scene;
    #camera;

    constructor(renderer, textureSize, computeFragmentShader = defaultFragmentShader) {
        // shader input is passed as a texture via a uniform
        const rgbaData = new Float32Array(textureSize * 4); // 4 for RGBA
        const dataTexture = new THREE.DataTexture(
            rgbaData,
            textureSize,
            1,
            THREE.RGBAFormat,
            THREE.FloatType
        );
        dataTexture.needsUpdate = true;
        this.#inputUniforms = {
            texture: { value: dataTexture }
        };

        // shader output is collected from the texture of a render target
        this.#outputRenderTarget = new THREE.WebGLRenderTarget(
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

    setInputTexture(texture) {
        this.#inputUniforms.texture.value = texture;
    }

    compute() {
        this.#renderer.render(this.#scene, this.#camera, this.#outputRenderTarget);
    }

    getOutputTexture() {
        return this.#outputRenderTarget.texture;
    }
}
