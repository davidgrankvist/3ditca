class CaParamForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <form>
                <div class="field">
                    <label class="label">Dimensions</label>
                </div>
                <div class="field has-addons">
                    <div class="control">
                        <input class="input" type="number" value="50">
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="50">
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="50">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Initialize random</label>
                    <div class="control">
                        <input class="input" type="number" value="0.5" step="0.01" min="0" max="1">
                    </div>
                </div>
                <div class="label">
                    <label class="label">Survive limits</label>
                </div>
                <div class="field has-addons">
                    <div class="control">
                        <input class="input" type="number" value="2" min="0" max="26">
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="9" min="0" max="26">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Revive limits</label>
                </div>
                <div class="field has-addons">
                    <div class="control">
                        <input class="input" type="number" value="9" min="0" max="26" >
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="9" min="0" max="26" >
                    </div>
                </div>
                <div class="field">
                    <button class="button is-primary" type="submit">Submit</button>
                </div>
            </form>
        `;

        const form = this.firstElementChild;
        form.addEventListener("submit", e => {
            e.preventDefault();
            this.collectData();
        });
    }

    collectData() {
    }
}
customElements.define("ca-param-form", CaParamForm);
