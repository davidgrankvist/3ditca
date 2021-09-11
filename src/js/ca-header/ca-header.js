class CaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a id="nav-tools" class="navbar-item">Tools</a>
                    <a class="navbar-item">Second</a>
                    <a class="navbar-item">Third</a>
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
    }
}
customElements.define("ca-header", CaHeader);
