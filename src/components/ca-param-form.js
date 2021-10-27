class CaParamForm extends HTMLElement {
    connectedCallback() {
        const dims = { x: 20, y: 20, z: 20 };
        this.innerHTML = `
            <form>
                <div class="field">
                    <label class="label">
                        <span class="icon-text">
                            <span class="icon">
                                <i class="fa fa-globe"></i>
                            </span>
                            <span>World size</span>
                        </span>
                    </label>
                </div>
                <div class="field is-grouped" style="max-width: 100%">
                    <div class="control" style="max-width: 30%;">
                        <input class="input" type="number" value="${dims.x}" min="0">
                    </div>
                    <div class="control" style="max-width: 30%;">
                        <input class="input" type="number" value="${dims.y}" min="0">
                    </div>
                    <div class="control" style="max-width: 30%;">
                        <input class="input" type="number" value="${dims.z}" min="0">
                    </div>
                </div>
                <div class="field">
                    <label class="label">
                        <span class="icon-text">
                            <span class="icon">
                                <i class="fa fa-cubes"></i>
                            </span>
                            <span>Initial activity</span>
                    </label>
                    <div class="control">
                        <input class="input" type="number" value="0.5" step="0.01" min="0" max="1">
                    </div>
                </div>
                <div class="field">
                    <div class="label">
                        <span icon-text">
                            <span class="icon">
                                <i class="fa fa-cube"></i>
                            </span>
                            <span>Stay active</span>
                        </span>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <input class="input" type="number" value="3" min="0" max="26">
                    </div>
                    <div class="control">
                        <input class="input" type="number" value="9" min="0" max="26">
                    </div>
                </div>
                <div class="field">
                    <label class="label">
                        <span icon-text">
                            <span class="icon">
                                <i class="fa fa-recycle"></i>
                            </span>
                            <span>Become active</span>
                        </span>
                    </label>
                </div>
                <div class="field is-grouped">
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
