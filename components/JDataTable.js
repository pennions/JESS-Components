import { JTable } from './JTable';

export class JDataTable extends JTable {

    constructor() {
        super();
    }

    constructTableContainer() {
        return document.createElement('div');
    }
}

customElements.define("j-data-table", JDataTable);