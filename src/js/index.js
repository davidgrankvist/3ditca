import "./ca-canvas/ca-canvas.js";
import "./ca-header/ca-header.js";
import "./ca-tools/ca-tools.js";

const caCanvas = document.createElement("ca-canvas");
caCanvas.setAttribute("max-x", 50);
caCanvas.setAttribute("max-y", 50);
caCanvas.setAttribute("max-z", 50);
const main = document.querySelector("main");
main.appendChild(caCanvas);
