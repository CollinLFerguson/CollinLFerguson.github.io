import addGlobalStylesToShadowRoot from "../functions/utils/addGlobalStylesToShadowRoot.js";

class RetroSelect extends HTMLElement {

    constructor() {
        super();

        this._options = [];
        this._value = null;
        this._open = false;
        this._highlightIndex = -1;

        this.attachShadow({ mode: "open" });
        //TODO: need to clean up this css.
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    font-family: inherit;
                }

                .select {
                    border: 1px solid var(--primary-color);
                    padding: 4px;
                    cursor: pointer;
                    background: transparent;
                    color: var(--primary-color);
                    display:flex

                }

                .arrow {
                    float: right;
                }

                .menu {
                    position: absolute;
                    left: 0;
                    right: 0;
                    border: 1px solid var(--primary-color);
                    background: black;
                    max-height: 150px;
                    overflow-y: auto;
                    display: none;
                    z-index: 9999;
                }

                .menu.open {
                    display: block;
                }

                .option {
                    padding: 4px;
                    cursor: pointer;
                }

                .option:hover,
                .option.selected {
                    background: var(--primary-color);
                    color: black;
                }
                .option.highlight {
                       outline: 1px dashed var(--primary-color);
                }
            </style>

            <div class="select" tabindex="0">
                <span class="label"></span>
                <span class="arrow">▾</span>
            </div>

            <div class="menu"></div>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot);
        
        this.$select = this.shadowRoot.querySelector(".select");
        this.$menu = this.shadowRoot.querySelector(".menu");
        this.$label = this.shadowRoot.querySelector(".label");

        this.$select.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggle();
        });
        this.$select.addEventListener("keydown", e => this.handleKey(e));

        document.addEventListener("click", e => {
            if (!e.composedPath().includes(this)) {
                this.close();
            }
        });
    }

    /* ---------- options ---------- */

    set options(arr) {
        this._options = arr;

        if (this._value === null && arr.length) {
            this._value = arr[0].value;
        }

        this.renderOptions();
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
        this.updateLabel();
        this.updateSelection();
    }

    /* ---------- rendering ---------- */

    renderOptions() {

        this.$menu.innerHTML = "";

        this._options.forEach(opt => {

            const el = document.createElement("div");
            el.className = "option";
            el.textContent = opt.label;
            el.dataset.value = opt.value;

            el.addEventListener("click", () => {
                this.value = opt.value;
                this.close();
                this.dispatchEvent(new Event("change"));
            });

            this.$menu.appendChild(el);
        });

        this.updateLabel();
    }

    updateLabel() {

        const found = this._options.find(o => o.value == this._value);

        this.$label.textContent = found ? found.label : "Select";
    }

    updateSelection() {
        this.$menu.querySelectorAll(".option").forEach(opt => {
            opt.classList.toggle(
                "selected",
                opt.dataset.value == this._value
            );
        });
    }

    updateHighlight() {
        const options = this.$menu.querySelectorAll(".option");

        options.forEach((opt, i) => {
            opt.classList.toggle("selected", i === this._highlightIndex);
        });

        if (options[this._highlightIndex]) {
            options[this._highlightIndex].scrollIntoView({
                block: "nearest"
            });
        }
    }
    /* ---------- open / close ---------- */

    toggle() {
        this._open ? this.close() : this.open();
    }

    open() {
        this._open = true;
        this.$menu.classList.add("open");

        this._highlightIndex = this._options.findIndex(
            o => o.value == this._value
        );

        this.updateHighlight();
    }

    close() {
        this._open = false;
        this.$menu.classList.remove("open");
    }

    /* ---------- keyboard ---------- */

    handleKey(e) {

        if (e.key === "Enter") {

            if (this._open && this._highlightIndex >= 0) {
                const option = this._options[this._highlightIndex];
                this.value = option.value;
                this.close();
                this.dispatchEvent(new Event("change"));
            } else {
                this.open();
            }

            e.preventDefault();
        }

        if (e.key === "ArrowDown") {

            if (!this._open) this.open();

            this._highlightIndex =
                (this._highlightIndex + 1) % this._options.length;

            this.updateHighlight();

            e.preventDefault();
        }

        if (e.key === "ArrowUp") {

            if (!this._open) this.open();

            this._highlightIndex =
                (this._highlightIndex - 1 + this._options.length) % this._options.length;

            this.updateHighlight();

            e.preventDefault();
        }

        if (e.key === "Escape") {
            this.close();
        }
    }
}

customElements.define("retro-select", RetroSelect);