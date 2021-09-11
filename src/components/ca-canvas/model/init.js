import CaState from "./CaState.js";
import { init3dArr } from "../arrayUtils.js";
import { ggolTransition } from "./transitions.js";
import { BinaryCell } from "./cellConstants.js";

export const initCa = (config) => {
    const dims = config.dims;
    const initCell = getInitCell(config.initCell);
    const initialGrid = init3dArr(dims, initCell);
    const transition = getTransition(config.transition);
    return new CaState(initialGrid, transition);
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

const getTransition = (transitionConf) => {
    switch(transitionConf.type) {
        case "ggol":
            return (x, y, z, state) => ggolTransition(x, y, z, state, transitionConf.args.surviveLimits, transitionConf.args.reviveLimits);
        default:
            return null;
    }
}
