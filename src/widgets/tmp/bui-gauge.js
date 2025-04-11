/*


Атрибуты:

Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIGauge extends LitElement {
	static properties = {
		gaugeType: { attribute: 'gauge_type', type: String },
		gaugeStyle: { attribute: 'gauge_style', type: String },
		minValue: { attribute: 'min_value', type: Number },
		maxValue: { attribute: 'max_value', type: Number },
		value: { type: Number },
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

	}
	.value {
		font-size: 2.5rem;
		font-weight: 400;
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	.units {
		font-size: 1.3rem;
	}
	.label-ranges {
		font-size: 1rem;
	}
	`;

	constructor() {
		super();
		this.gaugeType = "Circle1";
		this.gaugeStyle = "1/2";
		this.minValue = 0;
		this.maxValue = 100;
		this.value = 50;
		this.color = "var(--sl-color-lime-600)";
		// Размер поля
		this.width = 100;
		this.height = 100;
	}

	gaugeCircle1() {
		// Тип шкалы
		let gaugeStyleData = [];
		switch(this.gaugeStyle){
			case "full":
				gaugeStyleData = [90, 1];
				break;
			case "3/4":
				gaugeStyleData = [135, 0.75];
				break;
			case "1/2":
				gaugeStyleData = [180, 0.5];
				break;
			default:
				gaugeStyleData = [135, 0.75];
		}
		const sectorWidth = 10;
		const sectorRadius = this.width / 2 - sectorWidth; // Радиус
		const sectorCircumference = this.calculateCircumference(sectorRadius); // Длина окружности
		const fillFull = this.mapRange(this.maxValue, this.minValue, this.maxValue, 0, sectorCircumference * gaugeStyleData[1]); // Полная окружности
		const fillValue = this.mapRange(this.value, this.minValue, this.maxValue, 0, sectorCircumference * gaugeStyleData[1]); // Текущее значение заполнености
		
		return html`
		<svg viewBox="${this.width/2*-1} ${this.height/2*-1} ${this.width} ${this.height}">
			<g fill="none" fill-opacity="0.1" stroke-width="${sectorWidth}" transform="rotate(${gaugeStyleData[0]})">
				<circle r="${sectorRadius}" stroke-dasharray="0 0 ${fillFull} ${sectorCircumference}" stroke="var(--sl-color-gray-500)" stroke-linecap="round" stroke-opacity="1.0"/> <!-- Полная шкала -->
				<circle r="${sectorRadius}" stroke-dasharray="0 0 ${fillValue} ${sectorCircumference}" stroke="${this.color}" stroke-linecap="round" stroke-opacity="1.0"/> <!-- Показатель -->
			</g>
			<g fill="var(--bui-widget-label-color)">
				<text x="0" y="0" dy="5" text-anchor="middle" class="value">${this.value}</text>
				<text x="0" y="0" dy="20" text-anchor="middle" class="units">${this.units}</text>
				
				<text x="0" y="0" dx="${this.width/2*-1}" dy="${this.height/2*gaugeStyleData[1]}" text-anchor="start" class="label-ranges">${this.minValue}</text>
				<text x="0" y="0" dx="${this.width/2}" dy="${this.height/2*gaugeStyleData[1]}" text-anchor="end" class="label-ranges">${this.maxValue}</text>
			</g>
		</svg>
		`;
	}

	render() {
		// Деления
		const d = 20;
		
		//const sectorLabelWidth = 8;
		//const sectorValueWidth = 4;
		// Окружность для шкалы меток
		//const sectorLabelRadius = width / 2 - sectorLabelWidth; // Радиус
		//const sectorLabelCircumference = this.calculateCircumference(sectorLabelRadius); // Длина окружности
		// Окружность для шкалы значения
		//const sectorValueRadius = width / 2 - sectorLabelWidth - sectorValueWidth * 2; // Радиус
		//const sectorValueCircumference = this.calculateCircumference(sectorValueRadius); // Длина окружности
		//
		//const fillFull = this.mapRange(this.maxValue, this.minValue, this.maxValue, 0, sectorLabelCircumference * gaugeStyleData[1]); // Полная окружности
		//
		//const fillValue = this.mapRange(this.value, this.minValue, this.maxValue, 0, sectorValueCircumference * gaugeStyleData[1]); // Текущее значение заполнености
		//
		//const fillStart = this.mapRange(25, this.minValue, this.maxValue, 0, circumference * gaugeTypeData[1]); // Начало окружности
		//const fillEnd = this.mapRange(this.value, this.minValue, this.maxValue, 0, circumference * gaugeTypeData[1]); // Конец окружности

		console.log(this.gaugeType);
		return html`
		${this.gaugeType === "Circle1" ? this.gaugeCircle1() : ''}
    	`;
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

}
customElements.define('bui-gauge', BUIGauge);
