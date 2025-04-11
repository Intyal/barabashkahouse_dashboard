/*
<bui-led color="lime"></bui-led>

Атрибуты:
	color			- CSS цвет.
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload
	[uib]value		- значение из msg.payload
Свойства:
	[uib]buiRanges	- массив из массивов [["ON","var(--sl-color-lime-600)"],["OFF","var(--sl-color-orange-300)"]].
					value сравнивается со значением из массива и при совпадении присваиваеися соотв. цвет.

color имеет приоритет, при его отсутствии применяется цвет из buiRanges.
*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUILed extends LitElement {
	static properties = {
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
		
	}
	.led {
		min-width: 10px;
		min-height: 10px;
		border-radius: 7px 7px 5px 5px;
		border-bottom: 2px solid color-mix(in oklab, var(--bui-widget-background-color), var(--sl-color-neutral-1000) 10%);
		margin-top: 4px;
	}
	`;

	constructor() {
		super();
	}

	render() {
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
					.color {
						background: ${rgb};
						box-shadow: 0 ${parseInt(5 * br)}px ${parseInt(10 + 15 * br)}px ${parseInt(6 * br)}px ${rgb};
					}
				</style>
			`;
		}
		const colorDefault = html`
			<style>
				.color {
					background: hsl(0deg 0% 60% / 60%);
					box-shadow: 0 5px 10px -1px hsl(0deg 0% 60% / 60%);
				}
			</style>
		`;
		
		return html`
			${colorCustom ? colorCustom : colorDefault}
			<div class="led color"></div>
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

	// Получения цвета по значению из массива
	getColorByValue(value, ranges) {
		if (Array.isArray(ranges)) {
			for (const [rangeValue, rangeColor] of ranges) {
				if (value == rangeValue) {
					return rangeColor;
				}
			}
			// Если значение отсутствует
			return undefined;
		} else {
			return undefined;
		}
	}

}
customElements.define('bui-led', BUILed);
