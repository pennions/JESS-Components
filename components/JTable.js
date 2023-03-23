import { backToStartIcon, goToEndIcon, nextIcon, previousIcon } from './EmbeddedFeatherIcons';
import { JBaseTable } from './JBaseTable';

export class JTable extends JBaseTable {
    counterClass = 'page-counter';
    itemsPerPageClass = 'items-per-page';
    paginationButtonClass = 'pagination-button';
    nextPageClass = "next-page";
    previousPageClass = "previous-page";
    lastPageClass = "last-page";
    firstPageClass = "first-page";

    get currentPage() {
        return this._currentPage || 1;
    }

    set currentPage(value) {
        this._currentPage = value;
        this.render();
    }

    get itemsPerPage() {
        return this._itemsPerPage || 50;
    }

    set itemsPerPage(value) {
        this._itemsPerPage = parseInt(value);
        this.render();
    }

    get events() {
        return this._events || [];
    }

    /**
     * Event is an object with the following signature: { selector: String, eventType: String, functionName: String }
     */
    set events(event) {
        const eventArray = Array.isArray(event) ? event : [event];
        this._events = this.events.concat(eventArray);
    }

    /**
     * the scale on which you can paginate.
     */
    get scale() {
        return this._scale || [10, 15, 20, 25, 50, 75, 100];
    }

    set scale(value) {
        this._scale = Array.isArray(value) ? value : value.split(",");
    }


    static get observedAttributes() {
        return super.observedAttributes.concat(["current-page", "items-per-page", "scale"]);
    };

    constructor() {
        super();

        this.events.push(
            {
                selector: "." + this.itemsPerPageClass,
                eventType: "change",
                callback: "handleItemsPerPage",
            });

        this.events.push(
            {
                selector: "." + this.paginationButtonClass,
                eventType: "click",
                callback: "handlePageFlip",
            });
    }

    attributeChangedCallback(name, oldValue, newValue) {

        if (name === "items-per-page") {
            this.itemsPerPage = newValue;
        }
        else if (name === "current-page") {
            this.currentPage = newValue;
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    constructPaginationElement() {
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add("row", "align-center", "justify-between", "my-1",);
        const itemsSelect = document.createElement('select');
        itemsSelect.classList.add("pr-1", this.itemsPerPageClass);
        const contentsLength = this.contents.length;
        const itemsPerPage = [...this.scale, contentsLength];

        for (const count of itemsPerPage) {
            const itemsOption = document.createElement('option');
            itemsOption.value = count;
            itemsOption.innerHTML = count === contentsLength ? "all" : count.toString();

            if (count === this.itemsPerPage) {
                itemsOption.setAttribute("selected", "");
            }
            itemsSelect.appendChild(itemsOption);
        }

        const currentCount = document.createElement('span');
        currentCount.classList.add(this.counterClass);
        currentCount.innerText = this.constructCountText();

        const selectionText = document.createElement("span");
        selectionText.classList.add("pr-1");
        selectionText.innerText = "Rows per page";

        const selectionContainer = document.createElement("div");
        selectionContainer.appendChild(selectionText);
        selectionContainer.appendChild(itemsSelect);

        paginationContainer.appendChild(this.constructPaginationButtons());
        paginationContainer.appendChild(currentCount);
        paginationContainer.appendChild(selectionContainer);

        return paginationContainer;
    }

    constructPaginationButtons() {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("row");

        const startButton = this.constructTableButton(backToStartIcon, this.paginationButtonClass);
        startButton.classList.add(this.firstPageClass);

        const previousButton = this.constructTableButton(previousIcon, this.paginationButtonClass);
        previousButton.classList.add(this.previousPageClass);

        if (this.currentPage === 1 || this.itemsPerPage === this.contents.length) {
            startButton.setAttribute("disabled", "");
            previousButton.setAttribute("disabled", "");
        }

        const nextButton = this.constructTableButton(nextIcon, this.paginationButtonClass);
        nextButton.classList.add(this.nextPageClass);

        const endButton = this.constructTableButton(goToEndIcon, this.paginationButtonClass);
        endButton.classList.add(this.lastPageClass);

        if (this.currentPage === this.getLastPageNumber() || this.itemsPerPage === this.contents.length) {
            nextButton.setAttribute("disabled", "");
            endButton.setAttribute("disabled", "");
        }

        buttonsContainer.appendChild(startButton);
        buttonsContainer.appendChild(previousButton);
        buttonsContainer.appendChild(nextButton);
        buttonsContainer.appendChild(endButton);

        return buttonsContainer;
    }

    constructCountText() {
        const itemCount = this.contents.length;
        let startNumber = this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
        let endNumber = this.itemsPerPage * this.currentPage;

        if (this.itemsPerPage === itemCount) {
            startNumber = 1;
            endNumber = itemCount;
        }

        return `${startNumber}-${endNumber} of ${itemCount}`;
    }

    handleItemsPerPage(event) {
        if (event.target.nodeName === "SELECT") {
            this.itemsPerPage = event.target.value;
            this.render();
        }
    }

    getLastPageNumber() {
        return Math.ceil(this.contents.length / this.itemsPerPage);
    }

    handlePageFlip(event) {
        const buttonParent = super._findParentElement(event.target, "BUTTON");
        const classList = buttonParent.classList;

        if (classList.contains(this.firstPageClass)) {

            this.currentPage = 1;
        }

        if (classList.contains(this.previousPageClass)) {

            if (this.currentPage !== 0) {
                this.currentPage--;
            }
        }

        const lastPage = this.getLastPageNumber();

        if (classList.contains(this.nextPageClass)) {

            if (lastPage !== this.currentPage) {
                this.currentPage++;
            }
        }

        if (classList.contains(this.lastPageClass)) {
            this.currentPage = lastPage;
        }

        this.render();
    }


    getPageContents() {
        if (!this.contents.length) return [];

        const itemCount = this.contents.length;
        let startNumber = this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
        let endNumber = this.itemsPerPage * this.currentPage;

        if (this.itemsPerPage === itemCount) {
            startNumber = 1;
            endNumber = itemCount;
        }
        return this.contents.slice(startNumber - 1, endNumber);
    }

    render() {
        super.beforeRender();
        this.classList.add("inline-block");
        const table = document.createElement('table');
        table.classList.add("table");
        const header = super.constructTableHeaderFromContents();
        table.appendChild(header);

        const tbody = super.constructTableBodyFromContents(this.getPageContents());
        table.appendChild(tbody);

        if (this.footerContents) {
            const footer = this.constructTableFooter();
            table.appendChild(footer);
        }
        const container = super.constructTableContainer();

        container.appendChild(this.constructPaginationElement());
        container.appendChild(table);

        if (this.itemsPerPage >= 25) {
            container.appendChild(this.constructPaginationElement());
        }

        this.innerHTML = container.outerHTML;
        super.afterRender();

    }
}

customElements.define("j-table", JTable);