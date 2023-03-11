import JOQ from '@pennions/joq';
import { sortAscendingIcon, sortDescendingIcon } from './EmbeddedFeatherIcons';

export class JTable extends HTMLElement {

    static get observedAttributes() {
        return ["contents", "footer"];
    };

    orderButtonClass = "order-by";

    set contents(value) {
        this._contents = new JOQ(value);
        this.render();
    }

    get contents() {
        return this._contents ? this._contents.execute() : [];
    }

    get queryableObject() {
        if (Array.isArray(this._contents)) {
            return new JOQ([]);
        }
        else {
            return this._contents;
        }
    }

    get footer() {
        return this._footer || '';
    }
    set footer(value) {
        this._footer = value;
        this.render();
    }

    get orderBy() {
        return this._orderBy || [];
    }
    set orderBy(value) {
        this._orderBy = Array.isArray(value) ? value : value.split(",").map(value => value.trim());
        const allProperties = this._orderBy.map(obp => obp.propertyName);

        for (const property of allProperties) {
            this.applySortToTable(property);
        }
        this.render();
    }

    constructor() {
        super();

        this.events = [
            {
                selector: "." + this.orderButtonClass,
                eventType: "click",
                callback: "handleSort",
            }
        ];
    }

    connectedCallback() {
        this.setContents();

        if (this.contents.length) {
            this.render();
        }
    }

    /** called when component is removed */
    disconnectedCallback() {
        this.removeEvents();
    }

    constructTableButton(icon, buttonClass) {
        const tableButton = document.createElement("button");
        tableButton.classList.add("p-0", "column", "no-border", "icon", buttonClass);
        tableButton.innerHTML = icon;
        return tableButton;
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

        switch (name) {
            case "contents": {
                this.setContents(newValue);
                break;
            }
            case "order-by": {
                this.orderBy = newValue;
            }
            default: {
                this[name] = newValue;
                break;
            }
        }
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
            const orderProperties = this.orderBy.find(obp => obp.propertyName === prop);
            const headerCell = document.createElement('th');
            headerCell.classList.add("py-1");

            const headerElement = document.createElement('button');
            headerElement.classList.add(this.orderButtonClass, "no-border", "row", "no-gap", "w-100", "no-wrap", "align-center");
            headerElement.dataset.property = prop;

            if (orderProperties) {

                let orderIcon = sortAscendingIcon;
                if (orderProperties.direction === 'desc') {
                    orderIcon = sortDescendingIcon;
                }
                const orderIconElement = document.createElement('span');
                orderIconElement.innerHTML = orderIcon;
                orderIconElement.classList.add("icon-black", "mr-1", "column");
                headerElement.append(orderIconElement);
            }

            const headerTextElement = document.createElement('span');
            headerTextElement.classList.add("stretch", "mx-1");
            headerTextElement.innerText = this.convertJsonKeyToTitle(prop);

            headerElement.appendChild(headerTextElement);

            headerCell.appendChild(headerElement);
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
                const textEl = document.createElement('span');
                textEl.classList.add("px-1");
                textEl.innerText = json[prop];
                td.appendChild(textEl);
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

    handleSort(event) {
        const buttonParent = this._findParentElement(event.target, "BUTTON");
        const property = buttonParent.dataset.property;

        this.applySortToTable(property);
        this.render();
    }

    applySortToTable(property) {
        const sortedProperty = this.queryableObject.sortDetails.find(sortDetail => sortDetail.propertyName === property);
        /** remove the one set */
        if (sortedProperty) {
            this._orderBy = this.orderBy.filter(orderBy => orderBy.propertyName !== sortedProperty.propertyName);
            this.queryableObject.sortDetails = this.queryableObject.sortDetails.filter(sortDetail => sortDetail.propertyName !== property);
        }

        if (!sortedProperty) {
            this.queryableObject.orderBy(property, "asc");
            this._orderBy.push({ propertyName: property, direction: "asc" });
        }
        else if (sortedProperty.direction === 'asc') {
            this.queryableObject.orderBy(property, "desc");
            this._orderBy.push({ propertyName: property, direction: "desc" });
        }
    }

    addEvents() {
        if (this.isConnected) {
            for (const eventToAdd of this.events) {
                const elements = this.querySelectorAll(eventToAdd.selector);

                for (const element of elements) {
                    /** the callback needs to be the key of the property corresponding to the function of the class, to preserve 'this' */
                    element.addEventListener(eventToAdd.eventType, (event) => this[eventToAdd.callback](event));
                }
            }
        }
    }

    removeEvents() {
        for (const eventToRemove of this.events) {
            const elements = this.querySelectorAll(eventToRemove.selector);

            for (const element of elements) {
                element.removeEventListener(eventToRemove.eventType, (event) => this[eventToRemove.callback](event));
            }
        }
    }

    _findParentElement(node, nodeName) {
        if (node.nodeName === nodeName) {
            return node;
        }
        else {
            return this._findParentElement(node.parentNode, nodeName);
        }
    }

    beforeRender() {
        this.removeEvents();
    }

    afterRender() {
        this.addEvents();
    }
}

customElements.define("j-table", JTable);