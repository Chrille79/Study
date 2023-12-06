import { LitElement, html, css, unsafeHTML } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

export class StudyEdit extends LitElement {
    static styles = css``;
    static properties = {
        markdown: { type: String },
    };

    render() {
        // assuming commmonmark library will properly sanitize code
        return html`<textarea>${this.markdown}</textarea>`;
    }
}


customElements.define('study-main', StudyMain);
