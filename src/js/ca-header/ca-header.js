class CaHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <a class="navbar-item">First</a>
                    <a class="navbar-item">Second</a>
                    <a class="navbar-item">Third</a>
                </div>
            </nav>
        `;
        this.style = `
            width: 100%;
            height: 100%;
        `;
    }
}
customElements.define("ca-header", CaHeader);
