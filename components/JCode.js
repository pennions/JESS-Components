function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}

/** removes the indentation caused by formatters and linters in the editor */
function removeExcessWhitespace(value) {
    const allWhitespaceGroups = value.match(/\s+(?=\S)/gmi);
    const firstGroup = allWhitespaceGroups[0];

    const groupsToTrim = allWhitespaceGroups.filter(awg => awg.includes(firstGroup));

    for (const group of groupsToTrim) {
        const altered = group.replace(firstGroup, "");

        value = value.replace(group, altered);
    }
    return value;
}

export class JCode extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const language = this.getAttribute("language");
        let contents = this.getAttribute("contents");

        let userEntry = contents ? contents : this.innerHTML.substring(1).trimEnd();
        if (language === "html" && !contents) {
            userEntry = removeExcessWhitespace(userEntry);
            userEntry = escapeHtml(userEntry);
            this.innerHTML = `<pre class="border language-${language} m-0"><code>${userEntry}</code></pre>`;
        }
        else {
            userEntry = escapeHtml(userEntry);
            userEntry = userEntry.replace(/\\n/gmi, '\n'); /** somehow replacing this, actually works. */
            this.innerHTML = `<pre class="border language-${language} m-0"><code>${userEntry}</code></pre>`;
        }
    }
}

customElements.define("j-code", JCode);