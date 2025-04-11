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

export class BUIGaugeCircle1 extends LitElement {
	static properties = {
		gaugeStyle: { attribute: 'gauge-style', type: String },
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
		--width: 2;
		--height: 2;
		--font-color: ;
		--font-size: 1em;

		grid-column-start: var(--left);
		grid-row-start: var(--top);
		grid-column-end: span var(--width);
		grid-row-end: span var(--height);

		display: flex;
		justify-content: space-between;
    	align-items: flex-end;

		font-size: var(--font-size);
	}
	.value {
		font-weight: 400;
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	.units {
		font-size: 16px;
	}
	.label-ranges {
		font-size: 12px;
	}
	`;

	constructor() {
		super();
		this.gaugeStyle = "34";
		this.minValue = 0;
		this.maxValue = 100;
		this.value = 0;
		this.valueOld = 0;
		this.fixed = 2;
		this.sectorWidth = 15;
		// Размер поля
		this.width = 100;
		this.height = 100;
	}

	gaugeCircle1() {
		// Тип шкалы
		const halfWidth = this.width / 2; // Половина ширины поля
		const valueFontSize = 12;//Number.parseInt(this.style.getPropertyValue('--font-size'));

		const gauge = {};
		switch(this.gaugeStyle){
			case "full":
			default:
				gauge.angle = 90;
				gauge.fill = 1;
				gauge.heightViewBox = this.height;
				gauge.valuePosition = [halfWidth, halfWidth, 0, valueFontSize / 4 + 2];
				break;
			case "34":
				gauge.angle = 135;
				gauge.fill = 0.75;
				gauge.heightViewBox = this.height;
				gauge.valuePosition = [halfWidth, halfWidth, 0, valueFontSize / 4 + 2];
				break;
			case "12":
				gauge.angle = 180;
				gauge.fill = 0.5;
				gauge.heightViewBox = this.height / 2 + 20;
				gauge.valuePosition = [halfWidth, halfWidth, 0, valueFontSize / 4 + 2 - 6];
				break;
		}

		const sectorRadius = this.width / 2 - (this.sectorWidth / 2); // Радиус
		const sectorCircumference = this.calculateCircumference(sectorRadius); // Длина окружности
		const fillFull = this.mapRange(this.maxValue, this.minValue, this.maxValue, 0, sectorCircumference * gauge.fill); // Полная окружности
		const valueNorm = this.value < this.minValue ? this.minValue : this.value > this.maxValue ? this.maxValue : this.value; 
		const valueOldNorm = this.valueOld < this.minValue ? this.minValue : this.valueOld > this.maxValue ? this.maxValue : this.valueOld; 
		const fillValue = this.mapRange(valueNorm , this.minValue, this.maxValue, 0, sectorCircumference * gauge.fill); // Текущее значение заполнености
		const fillValueOld = this.mapRange(valueOldNorm, this.minValue, this.maxValue, 0, sectorCircumference * gauge.fill); // Предыдущее значение заполнености
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
		<svg viewBox="0 0 ${this.width} ${gauge.heightViewBox}">
			<animate
				id="anim-dasharray"
				href="#value-fill"
				attributeName="stroke-dasharray"
				attributeType="XML"
				from="0 0 ${fillValueOld} ${sectorCircumference}"
				to="0 0 ${fillValue} ${sectorCircumference}"
				begin="0s"
				dur="1s" 
				additive="replace"
				fill="freeze"
			/>
			${this.buiRanges || this.colorGradient ? svg`
			<animate
				id="anim-color"
				href="#value-fill"
				attributeName="stroke"
				attributeType="XML"
				from="${colorOld}"
				to="${color}"
				begin="0s"
				dur="1s" 
				additive="replace"
				fill="freeze"
			/>
			` : ``
			}
			<g fill="none" fill-opacity="0.1" stroke-width="${this.sectorWidth}" transform="rotate(${gauge.angle} ${halfWidth} ${halfWidth})">
				<!-- Полная шкала -->
				<circle
					cx="${halfWidth}"
					cy="${halfWidth}"
					r="${sectorRadius}"
					stroke-dasharray="0 0 ${fillFull} ${sectorCircumference}"
					stroke="var(--color-gray-500)"
					stroke-linecap="round"
				/>
				<!-- Текущее значение на шкале -->
				<circle
					id="value-fill"
					cx="${halfWidth}"
					cy="${halfWidth}"
					r="${sectorRadius}"
					stroke-dasharray="0 0 ${fillValue} ${sectorCircumference}"
					stroke="${color}"
					stroke-linecap="round"
				/>
			</g>
			${this.visibleValueOff ? `` : svg`
			<!-- Текущее значение в цифре -->
			<g fill="var(--bui-widget-color)">
				<text x="${gauge.valuePosition[0]}" y="${gauge.valuePosition[1]}" dx="${gauge.valuePosition[2]}" dy="${gauge.valuePosition[3]}" text-anchor="middle" class="value">${valueFixed}</text>
				<text x="${gauge.valuePosition[0]}" y="${gauge.valuePosition[1]}" dx="${gauge.valuePosition[2]}" dy="${gauge.valuePosition[3] + 12}" text-anchor="middle" class="units">${this.units}</text>
			</g>
			`}
			${this.visibleRangeOff ? `` : svg`
			<!-- Мин/Макс значения -->
			<g fill="var(--bui-widget-color)">
				<text x="0" y="100%" dx="0" dy="0" text-anchor="start" class="label-ranges">${this.minValue}</text>
				<text x="100%" y="100%" dx="0" dy="0" text-anchor="end" class="label-ranges">${this.maxValue}</text>
			</g>
			`}
			<!-- Линии разметки -->
			<g stroke-opacity="0">
				<line x1="${halfWidth}" y1="0" x2="${halfWidth}" y2="${this.height}" stroke="green"/>
				<line x1="0" y1="${halfWidth}" x2="${this.width}" y2="${halfWidth}" stroke="green"/>
			</g>
			
		</svg>
		`;
	}

	get animateDash() {
		//console.log(this.renderRoot?.querySelector('#anim-dasharray') ?? null);
		return this.renderRoot?.querySelector('#anim-dasharray') ?? null;
	}

	get animateColor() {
		return this.renderRoot?.querySelector('#anim-color') ?? null;
	}

	render() {

		const toRender = this.gaugeCircle1();
		this.valueOld = this.value;
		this.colorOld = this.color;

		return toRender;
	}

	calculateCircumference(radius) {
		return 2 * Math.PI * radius;
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
customElements.define('bui-gauge-circle-1', BUIGaugeCircle1);
