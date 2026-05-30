import addGlobalStylesToShadowRoot from "../functions/utils/addGlobalStylesToShadowRoot.js";

class StatBoxCurrMax extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
            <div class="stat-box">
                <div class="box-label">
                    <span class="label"></span>
                </div>

                <div class="input-row">
                    <input type="number" class="curr">
                    <span>/</span>
                    <input type="number" class="max">
                </div>
            </div>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot);
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".label").textContent =
            this.getAttribute("label") ?? "";

        // Listen for input changes and dispatch stat-changed event
        const currInput = this.shadowRoot.querySelector('.curr');
        const maxInput = this.shadowRoot.querySelector('.max');
        const dispatchChange = () => {
                this.dispatchEvent(new CustomEvent('stat-changed', {
                    detail: {
                        name: this.label,
                        curr: this.curr,
                        max: this.max
                    },
                    bubbles: true,
                    composed: true
                }));
        };
        currInput.addEventListener('input', dispatchChange);
        maxInput.addEventListener('input', dispatchChange);
    }

    // getter/setter for curr
    get curr() {
        return Number(this.shadowRoot.querySelector(".curr").value);
    }
    set curr(val) {
        this.shadowRoot.querySelector(".curr").value = val;
    }

    // getter/setter for max
    get max() {
        return Number(this.shadowRoot.querySelector(".max").value);
    }
    set max(val) {
        this.shadowRoot.querySelector(".max").value = val;
    }

    get label(){
        return this.getAttribute("label") ?? "stat";
    }

    get statObject(){
        const label = this.getAttribute("label") ?? "stat";
        const id = this.id
        
        return { 
            [id]: {
                label: label,
                curr: this.curr,
                max: this.max
            }
        };
    }
}

customElements.define("stat-box-curr-max", StatBoxCurrMax);