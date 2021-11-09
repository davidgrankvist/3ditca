import CaState from "./CaState.js";
import { init3dArr } from "../arrayUtils.js";
import { BinaryCell } from "./cellConstants.js";

export const initCa = (config) => {
    const dims = config.dims;
    const initCell = getInitCell(config.initCell);
    const initialGrid = init3dArr(dims, initCell);
    const limits = config.transition.args;
    return new CaState(initialGrid, limits.surviveLimits, limits.reviveLimits);
};


const randomize = (r) => Math.random() > r ? BinaryCell.ON : BinaryCell.OFF;

const getInitCell = (initConf) => {
    switch(initConf.type) {
        case "random":
            return () => randomize(initConf.args.r);
        default:
            return null;
    }
};
