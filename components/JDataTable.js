import { JTable } from './JTable';

export class JDataTable extends JTable {

    constructor() {
        super();
    }

    render() {
        const tableElement = this.constructTableFromContents(this.contents);
        this.innerHTML = `<div><h1>Hello World</h1>frou frou${tableElement.outerHTML}</div>`;
    }
}

customElements.define("j-data-table", JDataTable);