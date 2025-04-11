// Пример
// <bui-page-grid label="Страница">
// </bui-page-grid>

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIPageGrid extends LitElement {
	static properties = {
		label: {},
	};
	// Стили привязаны к этому элементу: они не будут конфликтовать со стилями на главной странице
	// или в других компонентах. Стилизация может быть доступена через пользовательские свойства CSS.
	static styles = css`
	:host
	{
		/** Размеры виджета по умолчанию **/
		/** Значения по умолчанию **/
		--default-cell-size: 30px;
		--default-page-footer-background-color: #1DC58F;
		--default-panel-label-color: #17181C;
		--default-panel-background-color: #0B0B12;
		--default-font-family: sans-serif;
		/* Стиль */
		display: block;
		width: 100%;
		/* Шрифт */
		font-family: var(--bui-font-family, var(--default-font-family));
		/* Цвета */
	}
	.footer {
		padding: 4px 4px 4px 8px;
		font-size: 2.5rem;
		font-variant: small-caps;
		background: var(--bui-page-footer-background-color, var(--default-page-footer-background-color));
		color: var(--bui-panel-label-color, var(--default-panel-label-color));
	}
	.panel {
		display: grid;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, var(--bui-background-cell-size, var(--default-cell-size)));
		grid-template-rows: repeat(8, var(--bui-background-cell-size, var(--default-cell-size)));
		grid-auto-rows: var(--bui-background-cell-size, var(--default-cell-size));
		gap: 0px;
		background: var(--bui-panel-background-color, var(--default-panel-background-color));
	}
	`;

	constructor() {
		super();
		// Определение реактивных свойств,
		// обновление реактивного свойства приводит к обновлению компонента.
		this.label = 'Страница';
	}

	// Метод render() вызывается при каждом изменении реактивных свойств.
	render() {
		return html`
		<div class="footer">${this.label}</div>
		<div part="panel" class="panel">
			<slot></slot>
		</div>
    `;
	}

}
customElements.define('bui-page-grid', BUIPageGrid);
