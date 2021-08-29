// init 3D array with zeros, or optionally with a callback
export const init3dArr = (dims, cb) => 
    new Array(dims.x).fill(null).map(
        (x, i) => new Array(dims.y).fill(null).map(
            (x, j) => new Array(dims.z).fill(null).map(
                (x, k) => cb ? cb(i, j, k) : 0)
        )
    );
