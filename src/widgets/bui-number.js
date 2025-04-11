/*
<bui-number value="36.62" fixed="1" units="°C"></bui-number>

Атрибуты:
	size			- размер шрифта
	fixed			- количество знаков после запятой
	units			- еденица измерения
	color			- CSS цвет.
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload
	value			- число, или значение из msg.payload
Свойства:
	[uib]buiRanges	- массив из массивов [Значение, Цвет].
					value сравнивается с диапазоном из массива и при совпадении присваиваеися соотв. цвет.

color имеет приоритет, при его отсутствии применяется цвет из buiRanges.
*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUINumber extends LitElement {
	static properties = {
    	value: { type: Number },
		fixed: {
			converter: attrValue => {
				return Number.parseInt(attrValue);
			}
		},
		units: { type: String },
		color: {
			converter: attrValue => {
				let style = new Option().style;
				style.color = attrValue;
				if (style.color == attrValue.toLowerCase())
					return attrValue
				else
					return undefined;
			}
		},
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
		justify-content: space-between;
    	align-items: flex-end;

		font-size: var(--font-size);

		/*height: calc(var(--bui-background-cell-size) * var(--height));*/
		overflow:hidden;
	}
	.value {
		color: var(--color);
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	.units {
		font-size: 0.5em;
		letter-spacing: normal;
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
				this.style.setProperty('--color', color);
			}
		}

		// Округление
		let value;
		if (this.value) {
			if (this.fixed >=0 && this.fixed <= 12) {
				value = this.value.toFixed(this.fixed);
			} else {
				value = this.value;
			}
		} else {
			value = "--";
		}

		return html`
			<div class="value">${value}</div>
			<div class="units">${this.units}</div>
    	`;
	}

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
			if (Number.isFinite(value)) {
				return ranges[ranges.length - 1][1];
			} else {
				return undefined;
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
customElements.define('bui-number', BUINumber);
