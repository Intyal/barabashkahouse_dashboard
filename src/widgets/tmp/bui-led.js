/*
<bui-led color="lime"></bui-led>

Атрибуты:
	size			- высота.
	color			- CSS цвет.
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload.
	[uib]value		- значение из msg.payload.
Свойства:
	[uib]buiRanges	- массив из массивов [["ON","var(--sl-color-lime-600)"],["OFF","var(--sl-color-orange-300)"]].
					value сравнивается со значением из массива и при совпадении присваиваеися соотв. цвет.

color имеет приоритет, при его отсутствии применяется цвет из buiRanges.
*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUILed extends LitElement {
	static properties = {
		size: { type: Number },
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
		value: { type: String },
	};

	static styles = css`
	:host {
		flex: 1;
		/*border-radius: 7px 7px 5px 5px;*/
		border-radius: 10px;
		border-bottom: 2px solid var(--sl-color-gray-200);
		margin-top: 4px;
		z-index: 0;
	}
	`;

	constructor() {
		super();
		this.size = 2;
	}

	render() {
		const size = this.size * 5;
		let color = undefined;
		let colorCustom = undefined;
		// Если передан цвет, берём его
		if (this.color) {
			color = this.color;
		}
		// иначе, если есть значения цветов от данных, берем цвет из массива
		else if (this.value && this.buiRanges) {
			color = this.getColorByValue(this.value, this.buiRanges);
		}
		if (color) {
			const rgb = this.convertColorToRgb(color);
			const rgbArray = rgb.replace("rgb(", "").replace(")", "").replaceAll(" ", "").split(",");
			const br = this.getBrightness(rgbArray);
			colorCustom = html`
				<style>
					:host {
						min-height: ${size}px;
						max-height: ${size}px;
						background: ${rgb};
						box-shadow: 0 ${parseInt(5 * br)}px ${parseInt(10 + 15 * br)}px ${parseInt(6 * br)}px ${rgb};
					}
				</style>
			`;
		}
		const colorDefault = html`
			<style>
				:host {
					min-height: ${size}px;
					max-height: ${size}px;
					background: var(--sl-color-gray-500);
					box-shadow: 0 5px 10px -1px var(--sl-color-gray-500);
				}
			</style>
		`;
		
		return html`
			${colorCustom ? colorCustom : colorDefault}
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
customElements.define('bui-led', BUILed);