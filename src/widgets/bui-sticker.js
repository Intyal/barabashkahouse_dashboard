/*
<bui-sticker label="Температура" style="--width: 3;--height: 4"></bui-sticker>

Атрибуты:
	label			- Заголовок виджета
	style
		--left		- Расположение виджета по X на странице
		--top		- Расположение виджета по Y на странице
		--width		- Ширина виджета
		--height	- Высота виджета
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUISticker extends LitElement {
	static properties = {

	};
	// Стили привязаны к этому элементу: они не будут конфликтовать со стилями на главной странице
	// или в других компонентах. Стилизация может быть доступена через пользовательские свойства CSS.
	static styles = css`
	:host {
		--left: ;
		--top: ;
		--width: 5;
		--height: 5;

		box-sizing: border-box; /* Свойство box-sizing: border-box, добавит поля, отступы и границы вовнутрь блока */
		border-radius: var(--bui-widget-border-radius, 0.5rem);
		/*border-radius: 0.5rem 0.5rem 1.5rem 1.5em;*/
		padding: var(--padding, 8px);
		margin: var(--margin, 1px 2px);
		border-top: 1px solid  color-mix(in oklab, var(--color), #ffffff 25%);
		/*border-left: 2px solid  color-mix(in oklab, var(--color), #ffffff 25%);*/
		border-bottom: 1px solid color-mix(in oklab, var(--color), #000000 25%);
		/*border-right: 3px solid color-mix(in oklab, var(--color), #000000 25%);*/
	
		grid-column-start: var(--left);
		grid-row-start: var(--top);
		grid-column-end: span var(--width);
		grid-row-end: span var(--height);

		display: grid;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
		gap: 0px;
		overflow:hidden;

		background: var(--color);
		font-size: var(--page-atom-size);
	}
	`;

	constructor() {
		super();
	}

	render() {
		return html`
			<slot></slot>
    	`;
	}

}
customElements.define('bui-sticker', BUISticker);
