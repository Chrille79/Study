import { LitElement, html, svg, css, createRef, ref } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { StudyMD } from './studyMD.js';

export class StudyCard extends LitElement {
    static styles = css`
    :host{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        background: #1e1e1e;
        background: #fff;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        padding: 5%;
    }

    article {
        background: #fff;
        border: solid 1px #ccc;
        padding: 5%;
        box-sizing: border-box;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        transition: 0.3s;
        border-radius: 5px;
        flex: 1 1 auto;
        white-space-collapse: preserve-breaks;
        position:relative;
    }

    article:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  
    }
    article .right, article .left{
        visibility:hidden;
    }
    article:hover .right, article:hover .left{
        visibility: visible;
        border-radius: 3px 0 0 3px;
        z-index: 1;
        cursor: pointer;
        position: absolute;
        width: auto;
        padding: 12px;
        color: white;
        background-color: rgba(0,0,0,0.8);
        font-weight: bold;
        font-size: 18px;
        transition: background-color 0.9s ease;
        top: 50%;
        margin-top: -22px;
    }
    article .left{
        left:0;

    }

    article .right{
        right: 0;

    }

    `;



    static properties = {
        data: { type: String },
        articles: { type: Array },
        index: { type: Number },
        articleRef: {}

    };

    constructor() {
        super();
        this.data = "";
        this.articles = [];
        this.index = 0;
        this.articleRef = createRef();
    }

    render() {
        //return this.renderAllView();

        return html`<article ${ref(this.articleRef)}>${this.renderArticle()}
        <span class="left" @click="${() => this.swipeDetected(null, 'left')}">❮</span>
        <span class="right" @click="${() => this.swipeDetected(null, 'right')}">❯</span>
        </article>`;
    }

    renderAllView() {
        if (this.data) {
            return html`<study-md markdown="${this.data}"></study-md>`;
        }
    }

    renderOneView() {
        return html`<article ${ref(this.articleRef)}>${this.renderArticle()}
            <span class="left" @click="${() => this.swipeDetected(null, 'left')}">❮</span>
            <span class="right" @click="${() => this.swipeDetected(null, 'right')}">❯</span>
        </article>`;
    }

    renderArticle() {
        if (this.data) {
            var article = this.articles[this.index];
            return html`<study-md markdown="${article}"></study-md>`;
        }

    }

    async connectedCallback() {
        super.connectedCallback()
        var response = await this.getData();
        this.data = await response.text();
        this.makeArticles();
    }

    makeArticles() {
        this.articles = this.data.split(/(?=#\s)/g);
    }

    async getData() {
        const response = await fetch('./religion.md');
        return response;
    }

    firstUpdated() {
        super.firstUpdated();
        const articleElement = this.renderRoot.querySelector("article");
        this.detectSwipe(articleElement, this.swipeDetected.bind(this));
        console.log(articleElement);
        console.log(this.articleRef.value);
    }

    swipeDetected(e, dir) {
        if (dir === 'left') this.index++;
        else if (dir === 'right') this.index--;
        this.index = (this.articles.length + this.index) % this.articles.length;
        console.log(dir);
    }

    detectSwipe(element, f) {
        var detect = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            minX: 30,   // min X swipe for horizontal swipe
            maxX: 30,   // max X difference for vertical swipe
            minY: 50,   // min Y swipe for vertial swipe
            maxY: 60    // max Y difference for horizontal swipe
        },
            direction = null

        element.addEventListener('touchstart', function (event) {
            var touch = event.touches[0];
            detect.startX = touch.screenX;
            detect.startY = touch.screenY;
            event.preventDefault();
        });

        element.addEventListener('touchmove', function (event) {
            event.preventDefault();
            var touch = event.touches[0];
            detect.endX = touch.screenX;
            detect.endY = touch.screenY;
        });

        element.addEventListener('touchend', function (event) {
            event.preventDefault();
            if (
                // Horizontal move.
                (Math.abs(detect.endX - detect.startX) > detect.minX)
                && (Math.abs(detect.endY - detect.startY) < detect.maxY)
            ) {
                direction = (detect.endX > detect.startX) ? 'right' : 'left';
            } else if (
                // Vertical move.
                (Math.abs(detect.endY - detect.startY) > detect.minY)
                && (Math.abs(detect.endX - detect.startX) < detect.maxX)
            ) {
                direction = (detect.endY > detect.startY) ? 'down' : 'up';
            }

            if ((direction !== null) && (typeof f === 'function')) {
                f(element, direction);
            }
        });
    }
}
customElements.define('study-card', StudyCard);
