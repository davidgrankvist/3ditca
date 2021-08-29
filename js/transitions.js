// all surrounding positions in a 3x3x3 grid
export const getMooreNeighborhood = (x, y, z, dims) => {
    const neighborhood = [];
    for (let i = x - 1; i <= x + 1; i++) {
        if (i < 0 || i >= dims.x) {
            continue;
        }
        for (let j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= dims.y) {
                continue;
            }
            for (let k = z - 1; k <= z + 1; k++) {
                if (k < 0 || k >= dims.z) {
                    continue;
                }
                if (i === x && j === y && k === z) {
                    continue;
                }
                neighborhood.push({ x: i, y: j, z: k});
            }
        }
    }
    return neighborhood;
};

/*
 * Generalized Conway's Game of Life:
 *  - 3D neighborhood
 *  - custom survive/revive limits
 *
 *  Assumes binary cells.
 */
export const ggolTransition = (x, y, z, state, surviveLimits, reviveLimits) => {
    const count = getMooreNeighborhood(x, y, z, state.getDimensions())
        .reduce((c, n) => state.getState(n.x, n.y, n.z) === 1 ? c + 1 : c, 0);
    const ownState = state.getState(x, y, z);
    const lims = ownState === 1 ? surviveLimits : reviveLimits;
    return count >= lims.min && count <= lims.max ? 1 : 0;
};
