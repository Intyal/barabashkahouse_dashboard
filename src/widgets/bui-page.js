/*
<bui-page slot="pages" role="page" label="Устройства" class="panel-background-cell"></bui-page>

Атрибуты:
	slot			- "pages"
	role			- "page"	
	label			- Заголовок страницы
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIPage extends LitElement {
	static properties = {
		label: { type: String },
		//cellWidthCount: { attribute: 'count-cell-width', type: Number },
	};
	// Стили привязаны к этому элементу: они не будут конфликтовать со стилями на главной странице
	// или в других компонентах. Стилизация может быть доступена через пользовательские свойства CSS.
	static styles = css`
	:host
	{
		--bui-background-cell-size: calc(100dvmin / var(--count-cell-width, 20));
		--bui-background-cell-height-count: 5;
		--page-atom-size: calc(var(--bui-background-cell-size) / 5);
		display: none;
		width: 100%;
		font-size: var(--page-atom-size);
		font-family: var(--bui-font-family);
		/*height: 100vh;*/
	}
	:host([active]) {
    	display: block;
	}
	.panel {
		display: grid;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, var(--bui-background-cell-size));
		grid-template-rows: repeat(var(--bui-background-cell-height-count), var(--bui-background-cell-size));
		grid-auto-rows: var(--bui-background-cell-size);
		gap: 0px;

		background: var(--bui-panel-background-color);
		/*height: 100%;*/
	}

	`;

	constructor() {
		super();
		//this.cellWidthCount = 20;
	}

	// Метод render() вызывается при каждом изменении реактивных свойств.
	render() {
		//this.calcCellSize();

		if (window.localStorage.getItem('selectedPage') === this.id) {
			this.setAttribute("active","");
		}

		return html`
		<div part="panel" class="panel">
			<slot></slot>
		</div>
    `;
	}

	/*
	calcCellSize() {
		const cellSize = document.body.clientWidth / this.cellWidthCount;
		const cellHeightCount = parseInt(document.body.clientHeight / cellSize);
		//this.style.setProperty('--bui-background-cell-size', cellSize + 'px');
		//this.style.setProperty('--bui-background-cell-height-count', cellHeightCount);
		//this.style.setProperty('display', 'block');
		//console.log(this.clientWidth);
		//this.style.setProperty('display', 'none');
	}
	*/

}
customElements.define('bui-page', BUIPage);
