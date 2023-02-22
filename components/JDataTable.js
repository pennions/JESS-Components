import { JTable } from './JTable';
import { backToStartIcon, goToEndIcon, nextIcon, previousIcon } from './EmbeddedFeatherIcons';

/**
 * implementing features of:
 * https://www.uxbooth.com/articles/designing-user-friendly-data-tables/
 */

export class JDataTable extends JTable {

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

    static get observedAttributes() {
        return super.observedAttributes.concat(["current-page", "items-per-page"]);
    };

    constructor() {
        super();
    }

    connectedCallback() {
        this.setContents();
        if (this.contents.length) {
            this.render();
        }
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
        const itemsPerPage = [10, 25, 50, 75, 100, this.contents.length];

        for (const count of itemsPerPage) {
            const itemsOption = document.createElement('option');
            itemsOption.value = count;
            itemsOption.innerHTML = count > 100 ? "all" : count.toString();

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

    constructPaginationButton(icon) {
        const paginationButton = document.createElement("button");
        paginationButton.classList.add("p-0", "column", this.paginationButtonClass);
        paginationButton.innerHTML = icon;
        paginationButton.classList.add("no-border", "icon-gray-dark");
        return paginationButton;
    }

    constructPaginationButtons() {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("row");

        const startButton = this.constructPaginationButton(backToStartIcon);
        startButton.classList.add(this.firstPageClass);

        const previousButton = this.constructPaginationButton(previousIcon);
        previousButton.classList.add(this.previousPageClass);

        if (this.currentPage === 1 || this.itemsPerPage === this.contents.length) {
            startButton.setAttribute("disabled", "");
            previousButton.setAttribute("disabled", "");
        }

        const nextButton = this.constructPaginationButton(nextIcon);
        nextButton.classList.add(this.nextPageClass);

        const endButton = this.constructPaginationButton(goToEndIcon);
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

    _findParentElement(node, nodeName) {
        if (node.nodeName === nodeName) {
            return node;
        }
        else {
            return this._findParentElement(node.parentNode, nodeName);
        }
    }

    getLastPageNumber() {
        return Math.ceil(this.contents.length / this.itemsPerPage);
    }

    handlePageFlip(event) {
        const buttonParent = this._findParentElement(event.target, "BUTTON");
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

    addEvents() {
        if (this.isConnected) {
            const itemsPerPage = this.querySelectorAll("." + this.itemsPerPageClass);

            for (const selectEl of itemsPerPage) {
                selectEl.addEventListener("change", (event) => this.handleItemsPerPage(event));
            }

            const paginationButtons = this.querySelectorAll("." + this.paginationButtonClass);

            for (const paginationButtonEl of paginationButtons) {
                paginationButtonEl.addEventListener("click", (event) => this.handlePageFlip(event));
            }

        }
    }

    removeEvents() {
        const itemsPerPage = this.querySelectorAll("." + this.itemsPerPageClass);
        if (this.isConnected && itemsPerPage.length) {
            for (const selectEl of itemsPerPage) {
                selectEl.removeEventListener("change", (event) => this.handleItemsPerPage(event));
            }
        }

        const paginationButtons = this.querySelectorAll("." + this.paginationButtonClass);
        if (this.isConnected && paginationButtons.length) {
            for (const paginationButtonEl of paginationButtons) {
                paginationButtonEl.removeEventListener("click", (event) => this.handlePageFlip(event));
            }
        }
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
        this.removeEvents();
        this.classList.add("inline-block");
        const table = document.createElement('table');
        table.classList.add("table");

        const tbody = this.constructTableBodyFromContents(this.getPageContents());
        const header = this.constructTableHeaderFromContents();
        table.appendChild(header);
        table.appendChild(tbody);

        if (this.footerContents) {
            const footer = this.constructTableFooter();
            table.appendChild(footer);
        }
        const container = document.createElement('div');

        container.appendChild(this.constructPaginationElement());
        container.appendChild(table);
        container.appendChild(this.constructPaginationElement());

        this.innerHTML = container.outerHTML;
        this.addEvents();
    }

    /** called when component is removed */
    disconnectedCallback() {
        this.removeEvents();
    }
}

customElements.define("j-data-table", JDataTable);