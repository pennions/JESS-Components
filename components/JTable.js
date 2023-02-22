export class JTable extends HTMLElement {
    static get observedAttributes() {
        return ["contents", "footer"];
    };

    get contents() {
        return this._contents || [];
    }
    set contents(value) {
        this._contents = value;
        this.render();
    }

    get footer() {
        return this._footer || '';
    }
    set footer(value) {
        this._footer = value;
        this.render();
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.setContents();
        if (this.contents.length) {
            this.render();
        }
    }

    setContents(newValue) {
        /** check if it came from an attibute callback, or directly set as property */
        const valueToSet = newValue || this.contents;
        try {
            this.contents = typeof valueToSet === "string" ? JSON.parse(valueToSet) || [] : valueToSet;
        }
        catch (e) {
            this.contents = [];
        }
    }

    render() {
        const table = document.createElement('table');
        table.classList.add("table");

        const tbody = this.constructTableBodyFromContents();
        const header = this.constructTableHeaderFromContents();
        table.appendChild(header);
        table.appendChild(tbody);

        if (this.footer) {
            const footer = this.constructTableFooter();
            table.appendChild(footer);
        }
        this.innerHTML = table.outerHTML;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "contents") {
            this.setContents(newValue);
        }
        else {
            this[name] = newValue;
        }
        this.render();
    }

    convertJsonKeyToTitle(jsonKey) {
        const result = jsonKey.replace(/([A-Z_])/g, ($1) => {
            if ($1 === "_") return " ";
            else return ` ${$1.toLowerCase()}`;
        });
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    constructTableHeaderFromContents() {
        const header = document.createElement('thead');
        if (!this.contents.length) return header;

        const properties = Object.keys(this.contents[0]);

        const headerRow = document.createElement('tr');

        for (const prop of properties) {
            const headerCell = document.createElement('th');
            headerCell.innerText = this.convertJsonKeyToTitle(prop);
            headerRow.appendChild(headerCell);
        }
        header.appendChild(headerRow);
        return header;
    }

    /**
     * @param {objectArray} customContents optional. Used for pagination
     */
    constructTableBodyFromContents(customContents) {
        const renderedContents = customContents || this.contents;

        const tbody = document.createElement('tbody');

        if (!renderedContents.length) return tbody;
        const totalNumberOfItems = renderedContents.length;

        for (let item = 0; item < totalNumberOfItems; item++) {

            const json = renderedContents[item];
            const row = document.createElement('tr');

            for (const prop in json) {
                const td = document.createElement('td');
                td.innerText = json[prop];
                row.appendChild(td);
            }
            tbody.appendChild(row);
        }
        return tbody;
    }

    constructTableFooter() {
        const footer = document.createElement("tfoot");

        const footerContents = this.footer;

        if (!footerContents) return footer;
        if (!this.contents.length) return footer;

        const propLength = Object.keys(this.contents[0]).length;

        const footerTr = document.createElement("tr");
        const footerTd = document.createElement("td");
        footerTd.setAttribute("colspan", propLength);
        footerTd.innerHTML = footerContents;
        footer.appendChild(footerTr);
        footerTr.appendChild(footerTd);
        return footer;
    }
}

customElements.define("j-table", JTable);