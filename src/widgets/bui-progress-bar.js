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

export class BUIProgressBar extends LitElement {
	static properties = {
    	value: { type: Number },
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
		justify-content: center;
    	align-items: normal;

		font-size: var(--font-size);
	}
	.content {
		flex: 1;
		min-height: 1em;
		max-height: var(--size);
		background: var(--color);
		box-shadow: var(--shadow);
		border-radius: var(--border-radius);
		border-bottom: var(--border-bottom);
		margin-top: var(--margin-top);
		z-index: 0;
	}
	`;

	constructor() {
		super();
		this.size = 2;
	}

	render() {
		let color = this.style.getPropertyValue('--color');
		// если есть значения цветов от данных, берем цвет из массива
		if (this.value && this.buiRanges) {
			color = this.getColorByValue(this.value, this.buiRanges);
			this.style.setProperty('--color', color);
		}
		if (color) {
			const rgb = this.convertColorToRgb(color);
			const rgbArray = rgb.replace("rgb(", "").replace(")", "").replaceAll(" ", "").split(",");
			const br = this.getBrightness(rgbArray);
			this.style.setProperty('--shadow', `0 ${parseInt(5 * br)}px ${parseInt(10 + 15 * br)}px ${parseInt(6 * br)}px var(--color)`);
		}
		
		return html`
			<div class="content">
				<div class=""></div>
			</div>
    	`;
	}

	// Функция получения значений RGB из любого представления цвета
	convertColorToRgb(color) {
		const div = document.createElement('div');
		div.style.color = color;
		document.body.appendChild(div);
		const style = window.getComputedStyle(div);
		const rgbValue = style.color;
		document.body.removeChild(div);

		return rgbValue;
	}

	// Функция получения "яркости" цвета
	getBrightness(rgb) {
		// Нормализуем компоненты цвета к диапазону от 0 до 1
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;
		
		// Вычисляем среднюю светлоту
		return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
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

}
customElements.define('bui-progress-bar', BUIProgressBar);
