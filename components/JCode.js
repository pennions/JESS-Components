export class JCode extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const language = this.getAttribute("language");
        let contents = this.getAttribute("contents");

        let userEntry = contents ? contents : this.innerHTML.substring(1).trimEnd();

        if (language === "html" && !contents) {
            userEntry = this.removeExcessWhitespace(userEntry);
            userEntry = this.escapeHtml(userEntry);
            this.innerHTML = `<pre class="border language-${language} m-0"><code>${userEntry}</code></pre>`;
        }
        else {
            userEntry = this.escapeHtml(userEntry);
            userEntry = userEntry.replace(/\\n/gmi, '\n'); /** somehow replacing this, actually works. */
            this.innerHTML = `<pre class="border language-${language} m-0"><code>${userEntry}</code></pre>`;
        }
    }

    /** removes the indentation caused by formatters and linters in the editor */
    removeExcessWhitespace(value) {
        if (!value) return value;

        const allWhitespaceGroups = value.match(/\s+(?=\S)/gmi);

        if (allWhitespaceGroups.length === 0) return value;
        const firstGroup = allWhitespaceGroups[0];

        const groupsToTrim = allWhitespaceGroups.filter(awg => awg.includes(firstGroup));

        for (const group of groupsToTrim) {
            const altered = group.replace(firstGroup, "");

            value = value.replace(group, altered);
        }
        return value;
    }

    escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

customElements.define("j-code", JCode);