/* Пример
https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed&icon.style=Rounded
*/

import { LitElement, html, css, unsafeHTML } from '../lit-all.min.js';

export class BUIHtml extends LitElement {
	static properties = {

	};

	static styles = css`
	:host {
		display: flex;
		align-self: var(--align, center);
		font-size: var(--svg-size, 1em);
	}
	.content {
		display: flex;
		width: 1em;
		height: 1em;
	}
	`;

	constructor() {
		super();
	}

	render() {
		let style = [];
		let color = undefined;
		// Если передан цвет, берём его
		if (this.color) {
			color = this.color;
		}
		// иначе, если есть значения цветов от данных, берем цвет из массива
		else if (this.value && this.buiRanges) {
			color = this.getColorByValue(this.value, this.buiRanges);
		}
		if (color) {
			color = this.getColorIsValid(color);
			style.push(`color: ${color}`);
		}
		
		return html`
			<div class="content" style="${style.length ? style.join(';') : ''}">
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
