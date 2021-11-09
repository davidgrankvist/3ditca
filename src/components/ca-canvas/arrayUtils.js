// init 3D array with zeros, or optionally with a callback
export const init3dArr = (dims, cb) => 
    new Array(dims.z).fill(null).map(
        (_, i) => new Array(dims.y).fill(null).map(
            (_, j) => new Array(dims.x).fill(null).map(
                (_, k) => cb ? cb(i, j, k) : 0)
        )
    );
