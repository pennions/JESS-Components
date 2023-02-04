function convertJsonKeyToTitle(jsonKey) {
    const result = jsonKey.replace(/([A-Z_])/g, ($1) => {
        if ($1 === "_") return " ";
        else return ` ${$1.toLowerCase()}`;
    });
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function constructTableFromContents(contents) {
    const jsonArray = JSON.parse(contents);
    const tbody = document.createElement('tbody');
    const items = jsonArray.length;

    /** create the header */
    const props = Object.keys(jsonArray[0]);
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');

    for (const prop of props) {
        const headerCell = document.createElement('th');
        headerCell.innerText = convertJsonKeyToTitle(prop);
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

    const table = document.createElement('table');
    table.appendChild(header);
    table.appendChild(tbody);

    return table.outerHTML;
}


export class JTable extends HTMLElement {
    static get observedAttributes() {
        return ["contents"];
    };

    constructor() {
        super();
    }

    connectedCallback() {
        let contents = this.getAttribute("contents");
        try {
            this.innerHTML = constructTableFromContents(contents);
        }
        catch (e) {
            return;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "contents") {
            this.innerHTML = constructTableFromContents(newValue);
        }
    }
}

customElements.define("j-table", JTable);