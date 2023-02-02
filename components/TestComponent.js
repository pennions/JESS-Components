export class JessTestComponent extends HTMLElement {
    constructor() {
        super();
        //   this._shadowRoot = this.attachShadow({ 'mode': 'open' });

        // this.shadowRoot.innerHTML = /*html*/ `
        // <input type="checkbox" value="clicked!" id="shadow-box" />
        // <label for="shadow-box">Click shadow box!</label>
        // <input type="checkbox" value="clicked 2" id="shadow-box2" />
        // <label for="shadow-box2">Click shadow box2!</label>
        // `;

        this.innerHTML = /*html*/ `
        <slot>
            <input type="checkbox" value="clicked!" id="shadow-box" />
            <label for="shadow-box">Click shadow box!</label>
            <input type="checkbox" value="clicked 2" id="shadow-box2" />
            <label for="shadow-box2">Click shadow box2!</label>
        </slot>
        `;

        // this.innerHTML = `{{ message }}`;

        // this.addEventListener("change", (event) => {
        //     let rootEvent = new CustomEvent('change', { detail: { checkbox: event.target.id, value: event.target.checked ? event.target.value : "" } });
        //     this.dispatchEvent(rootEvent);
        // });
    }
}

export class JessTestComponent2 extends JessTestComponent {
    constructor() {
        super();

        console.log(this.innerHTML);
    }
}

customElements.define("jess-test-component", JessTestComponent);

customElements.define("jess-test-component2", JessTestComponent2);