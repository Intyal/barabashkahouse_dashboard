/*
<bui-basic label="Температура" style="--width: 3;--height: 4"></bui-basic>

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

export class BUIBasic extends LitElement {
	static properties = {
		label: { type: String },
	};
	// Стили привязаны к этому элементу: они не будут конфликтовать со стилями на главной странице
	// или в других компонентах. Стилизация может быть доступена через пользовательские свойства CSS.
	static styles = css`
	:host {
		--left: ;
		--top: ;
		--width: 5;
		--height: 5;
		--justify-content: space-between;
		box-sizing: border-box; /* Свойство box-sizing: border-box, добавит поля, отступы и границы вовнутрь блока */
		border-radius: var(--bui-widget-border-radius, 0.5rem);
		/*border-radius: 0.5rem 0.5rem 1.5rem 1.5em;*/
		padding: var(--bui-widget-padding, 8px);
		margin: var(--bui-widget-margin, 1px 2px);
		border-top: 2px solid  color-mix(in oklab, var(--bui-widget-background-color), #ffffff 25%);
		/*border-left: 2px solid  color-mix(in oklab, var(--bui-widget-background-color), #ffffff 25%);*/
		border-bottom: 3px solid color-mix(in oklab, var(--bui-widget-background-color), #000000 25%);
		/*border-right: 3px solid color-mix(in oklab, var(--bui-widget-background-color), #000000 25%);*/
		overflow:hidden;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: stretch;
		grid-column-start: var(--left);
		grid-row-start: var(--top);
		grid-column-end: span var(--width);
		grid-row-end: span var(--height);
		font-family: var(--bui-font-family);
		font-size: 1.2em;
		font-variant: small-caps;
		background: var(--bui-widget-background-color);
	}
	.content {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: var(--justify-content);
		align-items: stretch;
		height: 100%;
	}
	.label {
		color: var(--bui-widget-color);
	}
	`;

	constructor() {
		super();
	}

	render() {
		return html`
		${this.label ? html`
			<div class="label">${this.label}</div>
		`: ``}
		<div class="content">
		${this.label ? html`
			<div></div>
		`: ``}
			<slot></slot>
		</div>
    	`;
	}

}
customElements.define('bui-basic', BUIBasic);
