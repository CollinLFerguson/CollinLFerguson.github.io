import addGlobalStylesToShadowRoot from "../functions/utils/addGlobalStylesToShadowRoot";

class StatBoxCurrMax extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
            <div class="stat-box">
                <div class="box-label">
                    <slot name="label"></slot>
                </div>

                <div class="input-row">
                    <input type="number" class="curr">
                    <span>/</span>
                    <input type="number" class="max">
                </div>
            </div>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot); // look here!
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".label").textContent =
            this.getAttribute("label") ?? "";
    }

    // getters
    get curr() {
        return Number(this.shadowRoot.querySelector(".curr").value);
    }

    get max() {
        return Number(this.shadowRoot.querySelector(".max").value);
    }

    // setters (optional but useful)
    set curr(val) {
        this.shadowRoot.querySelector(".curr").value = val;
    }

    set max(val) {
        this.shadowRoot.querySelector(".max").value = val;
    }
}

customElements.define("stat-box-curr-max", StatBoxCurrMax);