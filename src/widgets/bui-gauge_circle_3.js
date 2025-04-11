/*
<bui-gauge-circle-3 max-value="100" units="ppb" fixed="0" topic="random/random1" color="var(--color-lime-600)" id="bui_b5ee43da4797aa68" value="89.7"></bui-gauge-circle-3>

Атрибуты:
	min-value		- минимальное значение шкалы
	max-value		- максимальное значение шкалы
	value			- текущее значение
	fixed			- количество знаков после запятой
	units			- еденица измерения
	color			- CSS цвет
	color-gradient	- CSS цвет, если указан параметр, цвет устанавливается в промежутке от color до color-gradient
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload
Свойства:

*/

import { LitElement, html, css, svg } from '../lit-core.min.js';

export class BUIGaugeCircle3 extends LitElement {
	static properties = {
		label: { type: String },
		minValue: { attribute: 'min-value', type: Number },
		maxValue: { attribute: 'max-value', type: Number },
		value: { type: Number },
		valueOld: { attribute: false },
		units: { type: String },
		fixed: {
			converter: attrValue => {
				return Number.parseInt(attrValue);
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
		majorTicks: { attribute: 'major-ticks', type: Number },
	};

	static styles = css`
	:host {

	}
	.label {
		color: var(--bui-widget-color);
	}
	.value {
		font-size: 56px;
		font-weight: 400;
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	.units {
		font-size: 24px;
	}
	.label-ranges {
		font-size: 24px;
	}
	`;

	constructor() {
		super();
		this.minValue = 0;
		this.maxValue = 100;
		this.value = 0;
		this.valueOld = 0;
		this.fixed = 2;
		this.majorTicks = 98;
		this.color = "var(--color-sky-500)";
		// Размер поля
		this.width = 200;
		this.height = 200;
	}

	gaugeCircle3() {
		const strokeWidth = 20;
		const radius = this.width / 2 - 1; // Радиус

		const majorTicksRadius = radius - 20; // Радиус
		const majorTicksCircumference = this.calculateCircumference(majorTicksRadius); // Длина окружности
		const angleToArc = this.mapRange(1, 0, 360, 0, majorTicksCircumference); // Длина окружности в 1 градусе

		const valueNorm = this.value < this.minValue ? this.minValue : this.value > this.maxValue ? this.maxValue : this.value; 
		const valueOldNorm = this.valueOld < this.minValue ? this.minValue : this.valueOld > this.maxValue ? this.maxValue : this.valueOld; 

		// Деления
		const majorTicks = this.majorTicks;
		//
		const halfWidth = this.width / 2;
		const pointStart = 45 / 2;
		const pointEnd = 360 - 45;
		//const pointValue = this.getPointOnCircle(majorTicksRadius, 90 + 24 + this.mapRange(this.value, 0, this.maxValue, 24, 336));
		//
		const angleValue = this.mapRange(valueNorm, this.minValue, this.maxValue, 0, majorTicksCircumference - 45 * angleToArc);
		const angleValueOld = this.mapRange(valueOldNorm, this.minValue, this.maxValue, 0, majorTicksCircumference - 45 * angleToArc);
		const fillPercent = this.mapRange(valueNorm , this.minValue, this.maxValue, 0, 100);
		const fillPercentOld = this.mapRange(valueOldNorm , this.minValue, this.maxValue, 0, 100);
		//console.log(angleValue + "/" + angleValueOld);

		// Округление
		let valueFixed = this.value;
		if (this.fixed >=0 && this.fixed <= 12) {
			valueFixed = this.value.toFixed(this.fixed);
		}

		// Цвет
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

		return html`
		<svg viewBox="0 0 ${this.width} ${this.height}">
			<!-- <polygon points="0,0 ${this.width},0 ${this.width},${this.width} 0,${this.width}" stroke-width="0" fill="#000"/> -->
			<defs>
				<filter id="shadow">
					<feDropShadow id="value-shadow" dx="0" dy="0" stdDeviation="0.8" flood-color="${color}" />
				</filter>
				<filter id="shadow2">
					<feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
				</filter>
			</defs>
			
			<!-- Обод -->
			<circle
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${radius}"
				fill="var(--color-gray-300)"
				style="filter:url(#shadow2);"
			/>
			<circle
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${radius - 4}" 
				fill="var(--bui-widget-background-color)"
			/>
			<circle
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${radius - 36}"
				fill="var(--bui-panel-background-color)"
			/>

			<g fill="var(--bui-widget-color)">
				<text x="${halfWidth}" y="${halfWidth}" dy="-35" text-anchor="middle" class="label">${this.label}</text>
			</g>
			<g fill="var(--bui-widget-color)">
				<text x="${halfWidth}" y="${halfWidth}" dy="18" text-anchor="middle" class="value">${valueFixed}</text>
			</g>
			<g fill="var(--bui-widget-color)">
				<text x="${halfWidth}" y="${this.width}" dy="-14" text-anchor="middle" class="units">${this.units}</text>
			</g>

			<!-- Градиент блика -->
			<radialGradient id="gradient--spot" fy="20%">
			<stop offset="10%"
				stop-color="white"
				stop-opacity=".2"/>
			<stop offset="70%"
				stop-color="white"
				stop-opacity="0"/>
			</radialGradient>
			<!-- Верхний блик -->
			<ellipse rx="55" ry="25" cx="${halfWidth}" cy="${halfWidth-38}"
				fill="url(#gradient--spot)"
				transform="rotate(-45, ${halfWidth}, ${halfWidth})">
			</ellipse>
			<!-- Нижний блик -->
			<ellipse rx="40" ry="20" cx="${halfWidth}" cy="${halfWidth-44}"
				fill="url(#gradient--spot)"
				transform="rotate(-225, ${halfWidth}, ${halfWidth})">
			</ellipse>

			<!-- Деления -->
			<circle
				mask="url(#mask-34)"
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${majorTicksRadius}"
				stroke-width="${strokeWidth}" 
				stroke-dasharray="1 ${majorTicksCircumference / majorTicks - 1}"
				stroke="var(--color-gray-300)"
				fill="none"
			/>
			<!-- Текущее значение -->
			<circle
				id="value"
				mask="url(#mask-value)"
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${majorTicksRadius}"
				stroke-width="${strokeWidth}" 
				stroke-dasharray="2 ${majorTicksCircumference / majorTicks - 2}"
				stroke="${color}"
				fill="none"
				style="filter:url(#shadow);"
			/>
			<!-- Маска выреза -->
			<mask id="mask-34" fill="#fff">
				<circle
					cx="${halfWidth}"
					cy="${halfWidth}"
					r="${majorTicksRadius}"
					stroke-dasharray="0 ${pointStart * angleToArc} ${pointEnd * angleToArc} ${majorTicksCircumference}"
					stroke="#fff"
					stroke-width="${strokeWidth}"
					fill="none"
					transform="rotate(90 ${halfWidth} ${halfWidth})"
				/>
			</mask>
			<!-- Маска текущего значения -->
			<mask id="mask-value" fill="#fff">
				<circle
					id="value-fill"
					cx="${halfWidth}"
					cy="${halfWidth}"
					r="${majorTicksRadius}"
					stroke-dasharray="0 ${pointStart * angleToArc} ${angleValue} ${majorTicksCircumference}"
					stroke="#fff"
					stroke-width="${strokeWidth}"
					fill="none"
					transform="rotate(90 ${halfWidth} ${halfWidth})"
				/>
			</mask>
			<animate
				id="anim-dasharray"
				href="#value-fill"
				href="#value-shadow"
				attributeName="stroke-dasharray"
				attributeType="XML"
				from="0 ${pointStart * angleToArc} ${angleValueOld} ${majorTicksCircumference}"
				to="0 ${pointStart * angleToArc} ${angleValue} ${majorTicksCircumference}"
				begin="0s"
				dur="1s" 
				additive="replace"
				fill="freeze"
			/>
			${this.buiRanges || this.colorGradient ? svg`
				<animate
					id="anim-color"
					href="#value"
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
			<!--
			<line x1="${halfWidth}" y1="0" x2="${halfWidth}" y2="${this.height}" stroke="green" stroke-opacity="0.2"/>
			<line x1="0" y1="${halfWidth}" x2="${this.width}" y2="${halfWidth}" stroke="green" stroke-opacity="0.2"/>
			<circle
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${majorTicksRadius}"
				stroke-dasharray="0 ${pointStart * angleToArc} ${pointEnd * angleToArc} ${majorTicksCircumference}"
				stroke="#fff"
				stroke-width="16"
				fill="none"
				transform="rotate(90 ${halfWidth} ${halfWidth})"
			/>
			-->
		</svg>
		`;
	}

	//
	get animate1() {
		return this.renderRoot?.querySelector('#anim-dasharray') ?? null;
	}

	get animate2() {
		return this.renderRoot?.querySelector('#anim-color') ?? null;
	}

	render() {

		const toRender = this.gaugeCircle3();
		this.valueOld = this.value;
		this.colorOld = this.color;

		return toRender;
	}

	//
	calculateCircumference(radius) {
		return 2 * Math.PI * radius;
	}

	//
	getPointOnCircle(radius, angleInDegrees) {
		var angleInRadians = angleInDegrees * Math.PI / 180;
		var x = radius * Math.cos(angleInRadians);
		var y = radius * Math.sin(angleInRadians);
		return {x: x, y: y};
	}
	
	//
	mapRange(value, inMin, inMax, outMin, outMax) {
		// Вычисляем процент значения value относительно входного диапазона
		const percent = (value - inMin) / (inMax - inMin);
		
		// Применяем этот процент к выходному диапазону
		return outMin + (outMax - outMin) * percent;
	}

	//
	updated(changed) {
		if (changed.has('value')) {
			if (this.animate1) {
				this.animate1.beginElement();
			}
			if (this.animate2) {
				this.animate2.beginElement();
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
customElements.define('bui-gauge-circle-3', BUIGaugeCircle3);
