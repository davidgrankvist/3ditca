class CaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a id="nav-tools" class="navbar-item">Tools</a>
                    <a id="nav-play" class="navbar-item">Play</a>
                </div>
            </nav>
        `;
        this.style = `
            width: 100%;
            height: 100%;
        `;
        document.getElementById("nav-tools").addEventListener("click", () => {
            const tools = document.querySelector("ca-tools");
            const visible = tools.getAttribute("visible");
            tools.setAttribute("visible", visible === "true" ? "false" : "true");
        });

        const playBtn = document.getElementById("nav-play");
        playBtn.addEventListener("click", () => {
            const canvas = document.querySelector("ca-canvas");
            if (playBtn.innerText === "Play") {
                playBtn.innerText = "Pause";
                canvas.dispatchEvent(new CustomEvent("ca-play"));
            } else {
                playBtn.innerText = "Play ";
                canvas.dispatchEvent(new CustomEvent("ca-pause"));
            }
        });
    }
}
customElements.define("ca-header", CaHeader);
