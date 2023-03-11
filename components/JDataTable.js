import { JPaginatedTable } from './JPaginatedTable';

export class JDataTable extends JPaginatedTable {

    constructor() {
        super();
    }

    constructTableContainer() {
        return document.createElement('div');
    }
}

customElements.define("j-data-table", JDataTable);