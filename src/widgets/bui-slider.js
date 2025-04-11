/*
<bui-gauge-circle-1 gauge-style="34" max-value="100" visible-range-off units="ppb" fixed="0" topic="random/random1" color="var(--color-lime-600)" color-gradient="var(--color-orange-300)" id="bui_b5ee43da4797aa68" value="89.7"></bui-gauge-circle-1>

Атрибуты:
	gauge-style		- стиль шкалы, full(полная), 34 (3/4), 12 (1/2)
	sector-width	- толщина шкалы
	min-value		- минимальное значение шкалы
	max-value		- максимальное значение шкалы
	visible-range-off -	Не отображать значения диапазона
	value			- текущее значение
	visible-value-off	- Не отображать текущее значение
	fixed			- количество знаков после запятой
	units			- еденица измерения
	color			- CSS цвет
	color-gradient	- CSS цвет, если указан параметр, цвет устанавливается в промежутке от color до color-gradient
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload
Свойства:
	[uib]buiRanges	- массив из массивов [Значение, Цвет].
					value сравнивается с диапазоном из массива и при совпадении присваиваеися соотв. цвет.

color имеет приоритет, при его отсутствии применяется цвет из buiRanges.
*/

import { LitElement, html, css, svg } from '../lit-core.min.js';

export class BUISlider extends LitElement {
	static properties = {
		minValue: { attribute: 'min-value', type: Number },
		maxValue: { attribute: 'max-value', type: Number },
		visibleRangeOff: { attribute: 'visible-range-off', type:Boolean },
		value: { type: Number },
		visibleValueOff: { attribute: 'visible-value-off', type:Boolean },
		valueOld: { attribute: false },
		units: { type: String },
		fixed: {
			converter: attrValue => {
				const fixed = Number.parseInt(attrValue);
				if (Number.isInteger(fixed)) {
					if (fixed < 0) {
						return 2;
					} else if (fixed > 5) {
						return 5;
					} else {
						return fixed;
					}
				} else {
					return undefined;
				}
			}
		},
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
		colorOld: { attribute: false },
		colorGradient: {
			attribute: 'color-gradient',
			converter: attrValue => {
				let style = new Option().style;
				style.color = attrValue;
				if (style.color == attrValue.toLowerCase())
					return attrValue
				else
					return undefined;
			}
		},
		sectorWidth: { attribute: 'sector-width', type: Number },
	};

	static styles = css`
	:host {
		--left: ;
		--top: ;
		--width: 5;
		--height: 2;

		grid-column-start: var(--left);
		grid-row-start: var(--top);
		grid-column-end: span var(--width);
		grid-row-end: span var(--height);

		width: 95%;
		height: 95%;
		align-content: center;
	}
	input[type=range] {
		width: 100%;
		height: 100%;
		background-color: transparent;
		-webkit-appearance: none;
		&::-webkit-slider-runnable-track {
			background: var(--color-neutral-0);
			border: 6px solid var(--color-gray-50);
			border-radius: 4px;
			width: 100%;
			height: 14px;
			cursor: pointer;
		}
		&::-webkit-slider-thumb {
			margin-top: -15px;
			width: 45px;
			height: 30px;
			background-color: var(--bui-widget-color);
					background-image:
						radial-gradient(closest-side, transparent 20%, var(--bui-widget-background-color) 50%),
						radial-gradient(closest-side, transparent 30%, hsl(0deg 0% 0%) 70%);
					background-size: 8px 8px;
					background-position: 2px 2px, 0px 0px;
			border: 2px solid var(--color-gray-200);
			border-radius: 6px;
			cursor: pointer;
			-webkit-appearance: none;
		}
		&::-moz-range-track {
			background: #207183;
			border: 10px solid #562425;
			border-radius: 4px;
			width: 100%;
			height: 22.6px;
			cursor: pointer;
		}
		&::-moz-range-thumb {
			width: 50px;
			height: 30px;
			background-color: var(--bui-widget-color);
					background-image:
						radial-gradient(closest-side, transparent 20%, var(--bui-widget-background-color) 50%),
						radial-gradient(closest-side, transparent 30%, hsl(0deg 0% 0%) 70%);
					background-size: 8px 8px;
					background-position: 2px 2px, 0px 0px;
			border: 2px solid #000000;
			border-radius: 6px;
			cursor: pointer;
		}
	}
	input[type=range]:focus {
		outline: none;
	}
	`;

	constructor() {
		super();
		this.minValue = 0;
		this.maxValue = 100;
		this.value = 0;
		this.valueOld = 0;
		this.fixed = 2;
		this.sectorWidth = 15;
		// Размер поля
		this.width = 100;
		this.height = 50;
	}

	Slider() {
		// Тип шкалы
		const halfWidth = this.width / 2; // Половина ширины поля
		const valueFontSize = Number.parseInt(this.style.getPropertyValue('--value-font-size'));

		const valueNorm = this.value < this.minValue ? this.minValue : this.value > this.maxValue ? this.maxValue : this.value; 
		const valueOldNorm = this.valueOld < this.minValue ? this.minValue : this.valueOld > this.maxValue ? this.maxValue : this.valueOld; 
		const fillPercent = this.mapRange(valueNorm , this.minValue, this.maxValue, 0, 100);
		const fillPercentOld = this.mapRange(valueOldNorm , this.minValue, this.maxValue, 0, 100);
		
		// Округление
		const valueFixed = this.value.toFixed(this.fixed);

		let color = undefined;
		let colorOld = undefined;
		// Если передан цвет, берём его
		if (this.color) {
			if (this.colorGradient) {
				color = this.mixColors(this.convertColorToRgb(this.color), this.convertColorToRgb(this.colorGradient), fillPercent);
				colorOld = this.mixColors(this.convertColorToRgb(this.colorOld), this.convertColorToRgb(this.colorGradient), fillPercentOld);
			} else {
				color = this.color;
			}
		}
		// иначе, если есть значения цветов от данных, берем цвет из массива
		else if (this.value && this.buiRanges) {
			color = this.getColorByNumber(this.value, this.buiRanges);
			colorOld = this.getColorByNumber(this.valueOld, this.buiRanges);
		}
		//console.log(color);

		return html`
		<input
			type="range"
			id="slider"
			min="0"
			max="100"
			value="90"
			step="10"
		/>
		`;
		// return html`
		// <svg viewBox="0 0 ${this.width} ${this.height}">
		// 	<line
		// 		x1="4" y1="${this.height / 2}" x2="${this.width - 4}" y2="${this.height / 2}"
		// 		stroke-width="10"
		// 		stroke="var(--color-gray-50)"
		// 		stroke-linecap="round"
		// 	/>
		// 	<line
		// 		x1="0" y1="${this.height / 2}" x2="${this.width}" y2="${this.height / 2}"
		// 		stroke-width="2"
		// 		stroke="var(--color-neutral-0)"
		// 		stroke-linecap="round"
		// 	/>
		// 	<g>
		// 		<path d="M3 19v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
		// 		<path d="M11 15h2"></path>
		// 		<path d="M9 12h6"></path>
		// 		<path d="M10 9h4"></path>
		// 	</g>
		// </svg>
		// `;
	}

	get animateDash() {
		return this.renderRoot?.querySelector('#anim-dasharray') ?? null;
	}

	get animateColor() {
		return this.renderRoot?.querySelector('#anim-color') ?? null;
	}

	render() {

		const toRender = this.Slider();
		this.valueOld = this.value;
		this.colorOld = this.color;

		return toRender;
	}

	mapRange(value, inMin, inMax, outMin, outMax) {
		// Вычисляем процент значения value относительно входного диапазона
		const percent = (value - inMin) / (inMax - inMin);
		
		// Применяем этот процент к выходному диапазону
		return outMin + (outMax - outMin) * percent;
	}

	updated(changed) {
		if (changed.has('value')) {
			if (this.animateDash) {
				this.animateDash.beginElement();
			}
			if (this.animateColor) {
				this.animateColor.beginElement();
			}
		}
	}

	// Получения цвета по числовому значению и массиву диапазонов
	getColorByNumber(number, ranges) {
		if (!Number.isNaN(number)) {
			if (Array.isArray(ranges)) {
				for (const [rangeValue, rangeColor] of ranges) {
					if (number <= rangeValue) {
						return rangeColor;
					}
				}
				// Если число превышает все диапазоны, вернуть последний цвет
				return ranges[ranges.length - 1][1];
			}
		}
	}

	// Получение значений RGB из любого представления цвета
	convertColorToRgb(color) {
		const div = document.createElement('div');
		div.style.color = color;
		document.body.appendChild(div);
		const style = window.getComputedStyle(div);
		const rgbValue = style.color;
		document.body.removeChild(div);

		return rgbValue;
	}

	// Вычисление промежуточного цвета
	mixColors(color1, color2, weight) {
		const rgbArray1 = color1.replace("rgb(", "").replace(")", "").replaceAll(" ", "").split(",");
		const rgbArray2 = color2.replace("rgb(", "").replace(")", "").replaceAll(" ", "").split(",");
		const weightNorm = weight / 100;
		const r = Math.round(Number.parseInt(rgbArray1[0]) + weightNorm * (rgbArray2[0] - rgbArray1[0]));
		const g = Math.round(Number.parseInt(rgbArray1[1]) + weightNorm * (rgbArray2[1] - rgbArray1[1]));
		const b = Math.round(Number.parseInt(rgbArray1[2]) + weightNorm * (rgbArray2[2] - rgbArray1[2]));
		
		return `rgb(${r}, ${g}, ${b})`;
	}

}
customElements.define('bui-slider', BUISlider);
