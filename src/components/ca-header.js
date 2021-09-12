class CaHeader extends HTMLElement {
    #state;

    constructor() {
        super();
        this.#state = { play: true };
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a id="nav-tools" class="navbar-item">
                        <span class="icon">
                            <i class="fas fa-cog"></i>
                        </span>
                    </a>
                    <a id="nav-play-btn" class="navbar-item">
                        <span class="icon">
                            <i id="nav-play-icon" class="fas fa-play"></i>
                        </span>
                    </a>
                </div>
            </nav>
        `;
        document.getElementById("nav-tools").addEventListener("click", () => {
            const tools = document.querySelector("ca-tools");
            const visible = tools.getAttribute("visible");
            tools.setAttribute("visible", visible === "true" ? "false" : "true");
        });

        const playBtnIcon = document.getElementById("nav-play-icon");
        document.getElementById("nav-play-btn").addEventListener("click", () => {
            const canvas = document.querySelector("ca-canvas");
            if (this.#state.play) {
                playBtnIcon.classList.replace("fa-play", "fa-pause");
                canvas.dispatchEvent(new CustomEvent("ca-play"));
            } else {
                playBtnIcon.classList.replace("fa-pause", "fa-play");
                canvas.dispatchEvent(new CustomEvent("ca-pause"));
            }
            this.#state.play = !this.#state.play;
        });
    }
}
customElements.define("ca-header", CaHeader);
