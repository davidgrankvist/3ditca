import "./ca-canvas/ca-canvas.js";

const caCanvas = document.createElement("ca-canvas");
caCanvas.setAttribute("width", window.innerWidth);
caCanvas.setAttribute("height", window.innerHeight);
caCanvas.setAttribute("max-x", 50);
caCanvas.setAttribute("max-y", 50);
caCanvas.setAttribute("max-z", 50);
document.body.appendChild(caCanvas);

const mn = 26;
const config = {
    dims: {
        x: 50,
        y: 50,
        z: 50
    },
    initCell: {
        type: "random",
        args: { r: 0.5 }
    },
    transition: {
        type: "ggol",
        args: {
            surviveLimits: {
                min: mn * 0.1,
                max: mn * 0.375
            },
            reviveLimits: {
                min: mn * 0.375,
                max: mn * 0.375,
            }
        }
    }
};
caCanvas.dispatchEvent(new CustomEvent("ca-config", { detail: config }));
