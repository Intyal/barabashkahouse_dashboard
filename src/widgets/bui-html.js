/* Пример
https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed&icon.style=Rounded
*/

import { LitElement, html, css, unsafeHTML } from '../lit-all.min.js';

export class BUIHtml extends LitElement {
	static properties = {

	};

	static styles = css`
	:host {
		--left: ;
		--top: ;
		--width: 1;
		--height: 1;

		grid-column-start: var(--left);
		grid-row-start: var(--top);
		grid-column-end: span var(--width);
		grid-row-end: span var(--height);

		display: flex;
		justify-content: var(--justify-content);
    	align-items: center;

		color: var(--color);
		font-size: var(--font-size);

		/*height: calc(var(--bui-background-cell-size) * var(--height));*/
		overflow:hidden;
	}
	.content {
		width: var(--size);
		height: var(--size);

		display: flex;
		justify-content: center;
	}
	`;

	constructor() {
		super();
	}

	render() {
		// если есть значения цветов от данных, берем цвет из массива
		if (this.value && this.buiRanges) {
			const color = this.getColorByValue(this.value, this.buiRanges);
			if (this.getColorIsValid(color)) {
				this.style.setProperty('--font-color', color);
			}
		}

		return html`
			<div class="content">
				<slot></slot>
				${this.buiHtmlText ? unsafeHTML(this.buiHtmlText) : ``}
			</div>
    	`;
	}

	// Получения цвета по значению из массива
	getColorByValue(value, ranges) {
		if (Array.isArray(ranges)) {
			for (const [rangeValue, rangeColor] of ranges) {
				if (Number.isFinite(value) && Number.isFinite(rangeValue)) {
					if (value <= rangeValue) {
						return rangeColor;
					}
				} else {
					if (value == rangeValue) {
						return rangeColor;
					}
				}
			}
			// Если значение отсутствует
			if (Number.isFinite(value) && Number.isFinite(rangeValue)) {
				if (value <= rangeValue) {
					return ranges[ranges.length - 1][1];
				}
			} else {
				if (value == rangeValue) {
					return undefined;
				}
			}
		}
	}

	// Проверка цвета на корректность
	getColorIsValid(color) {
		let style = new Option().style;
		style.color = color;
		if (style.color == color.toLowerCase())
			return color
		else
			return undefined;
	}

}
customElements.define('bui-html', BUIHtml);
