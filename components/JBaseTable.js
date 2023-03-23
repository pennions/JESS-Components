import JOQ from '@pennions/joq';
import { sortAscendingIcon, sortDescendingIcon } from './EmbeddedFeatherIcons';

export class JBaseTable extends HTMLElement {

    properties = new Set();
    propertyLabelDictionary = {};

    uniqueEntriesByProperties = {};

    _orderBy = [];
    _filters = [];

    static get observedAttributes() {
        return ["contents", "footer"];
    };

    orderButtonClass = "order-by";

    set contents(value) {
        this.analyzeData(value);
        this._contents = new JOQ(value);
        this.render();
    }

    get contents() {
        return this._contents ? this._contents.execute() : [];
    }

    get queryableObject() {
        if (Array.isArray(this._contents)) {
            return new JOQ(this._contents);
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

    get filters() {
        return this._filters || [];
    }
    set filters(value) {
        this._filters = value;

        for (const filter of this.filters) {
            this.applyFilterToTable(filter);
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
            },
            {
                selector: '.filterlist',
                eventType: "change",
                callback: "handleFilter"
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

    constructFilterSelectlist(options, property) {
        const sortedOptions = Array.from(options).sort((a, b) => a.toString().localeCompare(b.toString()));

        const selectlistEl = document.createElement('select');
        selectlistEl.dataset.property = property;
        const allOption = document.createElement('option');
        allOption.value = "all";
        allOption.innerText = "all";
        selectlistEl.appendChild(allOption);

        const activeFilter = this.filters.find(filter => filter.propertyName === property);

        for (const option of sortedOptions) {
            const optionEl = document.createElement('option');
            optionEl.value = option;
            optionEl.innerText = option;

            if (activeFilter && activeFilter.value === optionEl.value) {
                optionEl.setAttribute("selected", "");
            }

            selectlistEl.appendChild(optionEl);
        }
        return selectlistEl;
    }

    constructTableButton(icon, buttonClass) {
        const tableButton = document.createElement("button");
        tableButton.classList.add("p-0", "column", "no-border", "icon", buttonClass);
        tableButton.innerHTML = icon;
        return tableButton;
    }

    analyzeData(value) {
        const contentLength = value.length;

        for (let index = 0; index < contentLength; index++) {
            const keys = Object.keys(value[index]);

            for (const key of keys) {
                this.properties.add(key);

                if (!this.uniqueEntriesByProperties[key]) {
                    this.uniqueEntriesByProperties[key] = new Set();
                }
                this.uniqueEntriesByProperties[key].add(value[index][key]);
            }
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
        this.beforeRender();
        const table = document.createElement('table');
        table.classList.add("table");

        const header = this.constructTableHeaderFromContents();
        const tbody = this.constructTableBodyFromContents();
        table.appendChild(header);
        table.appendChild(tbody);

        if (this.footer) {
            const footer = this.constructTableFooter();
            table.appendChild(footer);
        }

        this.innerHTML = table.outerHTML;
        this.afterRender();
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
        if (typeof jsonKey !== 'string') jsonKey = jsonKey.toString();
        if (this.propertyLabelDictionary[jsonKey]) return this.propertyLabelDictionary[jsonKey];

        const result = jsonKey.replace(/([A-Z_])/g, ($1) => {
            if ($1 === "_") return " ";
            else return ` ${$1.toLowerCase()}`;
        });
        const convertedKey = result.charAt(0).toUpperCase() + result.slice(1);
        this.propertyLabelDictionary[jsonKey] = convertedKey;
        return convertedKey;
    }

    constructTableHeaderFromContents() {
        const header = document.createElement('thead');
        if (!this.properties.size) return header;

        const headerRow = document.createElement('tr');

        for (const prop of this.properties) {
            const groupBySelectlistElement = this.constructFilterSelectlist(this.uniqueEntriesByProperties[prop], prop);

            groupBySelectlistElement.classList.add("w-100", "filterlist");

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
            headerCell.appendChild(groupBySelectlistElement);
            headerRow.appendChild(headerCell);
        }
        header.appendChild(headerRow);
        return header;
    }

    /**
     * @param {objectArray} customContents optional. Used for pagination
     */
    constructTableBodyFromContents(customContents) {
        const renderedContents = customContents && customContents.length ? customContents : this.contents;
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

    handleFilter(event) {
        const propertyName = event.target.dataset.property;

        this.applyFilterToTable({ propertyName, operator: "==", value: event.target.value });
        this.render();
    }

    /**
     * @param {*} filterDetail  propertyName: string, value: any, operator: FilterOperator 
     */
    applyFilterToTable(filterDetail) {
        const property = filterDetail.propertyName;

        this.queryableObject.filterDetails = this.queryableObject.filterDetails.filter(filterDetail => filterDetail.propertyName !== property);
        this._filters = this.filters.filter(filterDetail => filterDetail.propertyName !== property);
        if (filterDetail.value === 'all') return;

        this.queryableObject.filterDetails.push(filterDetail);
        this._filters.push(filterDetail);
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

customElements.define("j-base-table", JBaseTable);