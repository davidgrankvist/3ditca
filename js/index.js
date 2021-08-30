import CaState from "./model/CaState.js";
import { ggolTransition } from "./model/transitions.js";
import { BinaryCell } from "./model/cellConstants.js";
import { init3dArr } from "./arrayUtils.js";
import World from "./World.js";
import RenderLoop from "./RenderLoop.js";

// init cell states and transition
const dim = 50;
const randomize = () => Math.random() > 0.5 ? BinaryCell.OFF : BinaryCell.ON;
const randomGrid = init3dArr({x: dim, y: dim, z: dim}, randomize);
const mn = 26;
const surviveLimits = { min: mn * 0.1, max: mn * 0.375 };
const reviveLimits = { min: mn * 0.375, max: mn * 0.375 };
const transition = (x, y, z, state) =>
    ggolTransition(x, y, z, state, surviveLimits, reviveLimits);
const caState = new CaState(randomGrid, transition);

// create graphics and start rendering
const world = new World(caState);
world.init();
const loop = new RenderLoop(world);
loop.start()
