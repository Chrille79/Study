import { LitElement, html, css, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import 'https://unpkg.com/commonmark@0.29.3/dist/commonmark.js'
export class StudyMD extends LitElement {
    static styles = css`
        h1{
            font-size: x-large;
        }
    `;
    static properties = {
        markdown: { type: String },
    };

    render() {
        const reader = new commonmark.Parser();
        const writer = new commonmark.HtmlRenderer({ safe: true });
        // assuming commmonmark library will properly sanitize code
        return html`${unsafeHTML(writer.render(reader.parse(this.markdown)))}`;
    }

    createRenderRoot() {
        return this;
    }
}


customElements.define('study-md', StudyMD);
