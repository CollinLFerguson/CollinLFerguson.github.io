import addGlobalStylesToShadowRoot from "../functions/utils/addGlobalStylesToShadowRoot.js";

class labeledTextBox extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
            <div class="stat-box">
                <div class="box-label">
                    <span class="label"></span>
                </div>
                <div class="input-row">
                    <div class="input-row">
                        <input type="text" id="text_input">
                    </div>
                </div>
            </div>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot);
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".label").textContent =
            this.getAttribute("label") ?? "";
    }

    // getters
    get label(){
        return this.getAttribute("label") ?? "stat";
    }
    get text(){
        return this.shadowRoot.querySelector(".text_input").value;
    }

    get statObject(){
        const label = this.getAttribute("label") ?? "stat";
        const id = this.id

        return {
            [id]: {
                label: `stat_${label}`,
                text: this.text
            }
        };
    }

    // setters (optional but useful)

    set text(val) {
        this.shadowRoot.querySelector(".text_input").value = val;
    }
}

customElements.define("labeled-text-box", labeledTextBox);