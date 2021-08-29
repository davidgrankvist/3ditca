import { init3dArr }from "./arrayUtils.js";

export default class CaState {
    #grid; // cell states 3D vector
    #transition; // (x, y, z, this) => next cell state
    #dimensions // convenience object for grid dimensions

    constructor(grid, transition) {
        this.#grid = grid;
        this.#transition = transition;
        this.#dimensions = {
            x: this.#grid.length,
            y: this.#grid[0].length,
            z: this.#grid[0][0].length
        };
    }

    update() {
        const dims = this.getDimensions();
        const nextGrid = init3dArr(dims);
        for (let x = 0; x < dims.x; x++) {
            for (let y = 0; y < dims.y; y++) {
                for (let z = 0; z < dims.z; z++) {
                    nextGrid[x][y][z] = this.#transition(x, y, z, this);
                }
            }
        }
        this.#grid = nextGrid;
    }

    getState(x, y, z) {
        return this.#grid[x][y][z];
    }

    getDimensions() {
        return this.#dimensions;
    }
}
