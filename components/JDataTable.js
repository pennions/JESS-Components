import { JPaginatedTable } from './JPaginatedTable';

export class JDataTable extends JPaginatedTable {

    constructor() {
        super();
    }

    constructTableContainer() {
        return document.createElement('div');
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
}

customElements.define("j-data-table", JDataTable);