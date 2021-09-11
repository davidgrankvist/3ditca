class CaParamForm extends HTMLElement {
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
                        <input class="input" type="number" value="3" min="0" max="26">
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
                        <input class="input" type="number" value="26" min="0" max="26" >
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="26" min="0" max="26" >
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
            const data = this.collectData();
            document.querySelector("ca-canvas")
                .dispatchEvent(new CustomEvent("ca-config", { detail: data }));
        });
    }

    collectData() {
        const form = this.firstElementChild;
        const values = Array.from(form.querySelectorAll("input")).map(input => parseFloat(input.value));

        const config = {
            dims: {
                x: values[0],
                y: values[1],
                z: values[2]
            },
            initCell: {
                type: "random",
                args: { r: values[3] }
            },
            transition: {
                type: "ggol",
                args: {
                    surviveLimits: {
                        min: values[4],
                        max: values[5],
                    },
                    reviveLimits: {
                        min: values[6],
                        max: values[7],
                    }
                }
            }
        };
        return config;
    }
}
customElements.define("ca-param-form", CaParamForm);
