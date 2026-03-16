import addGlobalStylesToShadowRoot from "../functions/utils/addGlobalStylesToShadowRoot.js";

class SkillTable extends HTMLElement {

    constructor() {
        super();

        this._stats = [];
        this._rollCallback = null;

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                td, th { border: 1px solid; padding: 4px; text-align: center; }
            </style>

            <div class="label"></div>

            <table>
                <thead>
                    <tr>
                        <th>Remove</th>
                        <th>Skill</th>
                        <th>Stat</th>
                        <th>LVL</th>
                        <th>Bonus</th>
                        <th>Total</th>
                        <th>Roll</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>

            <button id="addRow">Add Row</button>
        `;

        addGlobalStylesToShadowRoot(this.shadowRoot);

        // Cache DOM nodes
        this.$tbody = this.shadowRoot.querySelector("tbody");
        this.$label = this.shadowRoot.querySelector(".label");
        this.$addRow = this.shadowRoot.getElementById("addRow");

        this.$addRow.addEventListener("click", () => this.addEmptyRow());

        // Event delegation
        this.$tbody.addEventListener("input", (e) => this.handleInput(e));
        this.$tbody.addEventListener("change", (e) => this.handleInput(e));
        this.$tbody.addEventListener("click", (e) => this.handleClick(e));
    }

    connectedCallback() {
        this.$label.textContent = this.getAttribute("label") ?? "";
    }

    /* ---------- stats ---------- */

    set stats(arr) {
        this._stats = arr || [];

        this.$tbody.querySelectorAll("tr").forEach(tr => {
            this.populateStatDropdown(tr);
            this.updateTotal(tr);
        });
    }

    get stats() {
        return this._stats;
    }

    /* ---------- callback ---------- */

    set rollCallback(fn) {
        this._rollCallback = fn;
    }

    /* ---------- row creation ---------- */

    addEmptyRow(data = {}) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><button class="remove">X</button></td>
            <td><input type="text" class="skill" value="${data.skill ?? ""}"></td>
            <td><retro-select class="stat"></retro-select></td>
            <td><input type="number" class="lvl" value="${data.lvl ?? 0}"></td>
            <td><input type="number" class="bonus" value="${data.bonus ?? 0}"></td>
            <td class="total">0</td>
            <td><button class="roll">Roll</button></td>
        `;

        this.$tbody.appendChild(tr);

        this.populateStatDropdown(tr, data.statValue);
        this.updateTotal(tr);
    }

    /* ---------- dropdown ---------- */

    populateStatDropdown(tr, selectedValue) {

        const select = tr.querySelector(".stat");

        select.options = this._stats.map(stat => ({
            label: stat.name,
            value: stat.value
        }));

        if (selectedValue !== undefined) {
            select.value = selectedValue;
        }
    }

    /* ---------- event handling ---------- */

    handleInput(e) {

        const tr = e.target.closest("tr");
        if (!tr) return;

        if (
            e.target.classList.contains("lvl") ||
            e.target.classList.contains("bonus") ||
            e.target.classList.contains("stat")
        ) {
            this.updateTotal(tr);
        }
    }

    handleClick(e) {

        const tr = e.target.closest("tr");
        if (!tr) return;

        if (e.target.classList.contains("remove")) {
            tr.remove();
        }

        if (e.target.classList.contains("roll")) {

            if (!this._rollCallback) return;

            this._rollCallback(this.getRowData(tr));
        }
    }

    /* ---------- totals ---------- */

    updateTotal(tr) {

        const stat = Number(tr.querySelector(".stat").value) || 0;
        const lvl = Number(tr.querySelector(".lvl").value) || 0;
        const bonus = Number(tr.querySelector(".bonus").value) || 0;

        tr.querySelector(".total").textContent = stat + lvl + bonus;
    }

    /* ---------- data API ---------- */

    get data() {

        return [...this.$tbody.querySelectorAll("tr")]
            .map(tr => this.getRowData(tr));
    }

    set data(rows) {

        this.$tbody.innerHTML = "";

        rows.forEach(row => this.addEmptyRow(row));
    }

    /* ---------- row data ---------- */

    getRowData(tr) {

        const statSelect = tr.querySelector(".stat");
        const statOption = this._stats.find(s => s.value == statSelect.value);

        return {
            skill: tr.querySelector(".skill").value,
            statName: statOption?.name,
            statValue: Number(statSelect.value),
            lvl: Number(tr.querySelector(".lvl").value),
            bonus: Number(tr.querySelector(".bonus").value),
            total: Number(tr.querySelector(".total").textContent)
        };
    }
}

customElements.define("skill-table", SkillTable);