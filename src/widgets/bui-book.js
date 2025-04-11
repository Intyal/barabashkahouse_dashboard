/*
<bui-book id="bui_book" tab-style="bottom">

Атрибуты:
	tab-style		- Расположение закладок страниц
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIBook extends LitElement {
	static properties = {
		tabStyle: { attribute: 'tab-style', type: String },
	};
	static styles = css`
	:host
	{
		/* Стиль */
		min-height: 100vh;
		max-height: 100vh;
		min-width: 100vw;
		max-width: 100vw;
		display: flex;
		/*flex-direction: column-reverse;*/
		align-items: normal;
		gap: 0px;
	}
	.nav_group {
		display: flex;
		/*flex-direction: row;*/
		flex-wrap: wrap;
		justify-content: center;

		font-size: 1dvmin;
	}
	.pages_group {
		flex-grow: 1;
	}
  `;

	constructor() {
		super();
		this.tabStyle = "bottom";
	}

	render() {
		const bottomStyle = html`<style> :host { flex-direction: column-reverse; } .nav_group { flex-direction: row; } </style>`;
		const leftStyle = html`<style> :host { flex-direction: row; } .nav_group { flex-direction: column; } </style>`;
		return html`
			${this.tabStyle === "bottom" ? bottomStyle : ''}
			${this.tabStyle === "left" ? leftStyle : ''}
			<div class="nav_group">
				<slot name="nav" id="nav"></slot>
			</div>
			<div></div>
			<div class="pages_group">
				<slot name="pages" id="pages"></slot>
			</div>
    `;
	}

}
customElements.define('bui-book', BUIBook);
