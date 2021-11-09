/*
 * Generalized Conway's Game of Life:
 *  - 3D neighborhood
 *  - custom survive/revive limits
 *
 *  Assumptions:
 *      - used in a gpu.js kernel
 *      - binary cells
 */
export const ggolTransitionGgpu = function (grid, dims, slims, rlims) {
    const x = this.thread.x;
    const y = this.thread.y;
    const z = this.thread.z;
    const xm = dims[0];
    const ym = dims[1];
    const zm = dims[2];

    // count active neighbors
    let count = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= xm) {
            continue;
        }
        for (let j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= ym) {
                continue;
            }
            for (let k = z - 1; k <= z + 1; k++) {
                if (k < 0 || k >= zm) {
                    continue;
                }
                if (i === x && j === y && k === z) {
                    continue;
                }
                if (grid[k][j][i] >= 0.5) {
                    count++;
                }
            }
        }
    }
    // check limits to determine next state
    const ownState = grid[this.thread.z][this.thread.y][this.thread.x];
    let nextState = 0;
    if (ownState >= 0.5) {
        nextState = count >= slims[0] && count <= slims[1] ? 1 : 0;
    } else {
        nextState = count >= rlims[0] && count <= rlims[1] ? 1 : 0;
    }
    return nextState;
}
