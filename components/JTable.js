export class JTable extends HTMLElement {
    static get observedAttributes() {
        return ["contents", "footer"];
    };

    get contents() {
        return this.tableContents || [];
    }
    set contents(value) {
        this.tableContents = value;
        this.render();
    }

    get footer() {
        return this.footerContents || '';
    }
    set footer(value) {
        this.footerContents = value;
        this.render();
    }

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.contents.length) {
            this.render();
        }
    }

    render() {
        const tableElement = this.constructTableFromContents(this.contents);
        this.innerHTML = tableElement.outerHTML;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.render();
    }

    convertJsonKeyToTitle(jsonKey) {
        const result = jsonKey.replace(/([A-Z_])/g, ($1) => {
            if ($1 === "_") return " ";
            else return ` ${$1.toLowerCase()}`;
        });
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    constructTableFromContents(contents) {
        const table = document.createElement('table');
        const footerContents = this.footer;
        let jsonArray = [];

        try {
            jsonArray = typeof contents === "string" ? JSON.parse(contents) || [] : contents;
        }
        catch (e) {
            return table;
        }

        const tbody = document.createElement('tbody');
        const items = jsonArray.length;

        if (items === 0) return table;

        /** create the header */
        const props = Object.keys(jsonArray[0]);
        const header = document.createElement('thead');
        const headerRow = document.createElement('tr');

        for (const prop of props) {
            const headerCell = document.createElement('th');
            headerCell.innerText = this.convertJsonKeyToTitle(prop);
            headerRow.appendChild(headerCell);
        }
        header.appendChild(headerRow);

        for (let item = 0; item < items; item++) {

            const json = jsonArray[item];
            const row = document.createElement('tr');

            for (const prop of props) {
                const td = document.createElement('td');
                td.innerText = json[prop];
                row.appendChild(td);
            }
            tbody.appendChild(row);
        }

        table.appendChild(header);
        table.appendChild(tbody);
        if (footerContents) {
            const footer = document.createElement("tfoot");
            const footerTr = document.createElement("tr");
            const footerTd = document.createElement("td");
            footerTd.setAttribute("colspan", props.length);
            footerTd.innerHTML = footerContents;
            footer.appendChild(footerTr);
            footerTr.appendChild(footerTd);
            table.appendChild(footer);
        }

        table.classList.add("table");
        return table;
    }
}

customElements.define("j-table", JTable);