/*
<bui-gauge-circle-2 gauge-style="34" max-value="100" units="ppb" fixed="0" topic="random/random1" id="bui_b5ee43da4797aa68" value="89.7"></bui-gauge-circle-2>

Атрибуты:
	gauge-style		- стиль шкалы, full(полная), 34 (3/4), 12 (1/2)
	min-value		- минимальное значение шкалы
	max-value		- максимальное значение шкалы
	visible-range-off -	Не отображать значения диапазона
	value			- текущее значение
	visible-value-off	- Не отображать текущее значение
	fixed			- количество знаков после запятой
	units			- еденица измерения
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload
Свойства:
	[uib]sectorColors	- массив из массивов [Угол начала, Угол конца, Цвет].
					Раскрашивает шкалу заданным цветом.
					[[0, 10, "var(--color-red-200)"], [10, 40, "var(--color-orange-300)"]]

color имеет приоритет, при его отсутствии применяется цвет из buiRanges.
*/

import { LitElement, html, css, svg, nothing } from '../lit-core.min.js';

export class BUIGaugeCircle2 extends LitElement {
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
		font-size: 36px;
		font-weight: 400;
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	.units {
		font-size: 20px;
	}
	.label-ranges {
		font-size: 20px;
	}
	`;

	constructor() {
		super();
		this.gaugeStyle = "34";
		this.minValue = 0;
		this.maxValue = 100;
		this.value = 0;
		this.valueOld = 0;
		this.fixed = 0;
		// Размер поля
		this.width = 200;
		this.height = 200;
		//
		this.buiSectorColors = [[0, 10, "var(--color-red-200)"], [10, 40, "var(--color-orange-300)"], [40, 80, "var(--color-green-400)"], [80, 140, "var(--color-lime-500)"]];
	}

	gaugeCircle2() {
		const halfWidth = this.width / 2; // Половина ширины поля
		const sectorWidth = 30; // Ширина сектора
		const widthTicksLine = 1;
		const radiusPin = sectorWidth / 4 + 2;

		// Тип шкалы
		const gauge = {};
		switch(this.gaugeStyle){
			case "full":
			default:
				gauge.angle = 0;
				gauge.heightViewBox = this.height;
				gauge.valuePosition = [halfWidth, sectorWidth + (halfWidth - radiusPin - sectorWidth) / 2, 0, 36 / 4 + 6];
				gauge.unitsPosition = [halfWidth, (halfWidth + radiusPin) + ((this.width - sectorWidth) - (halfWidth + radiusPin)) / 2, 0, 20 / 4];
				break;
			case "34":
				gauge.angle = 90;
				gauge.heightViewBox = this.height;
				gauge.valuePosition = ["50%", this.width - sectorWidth, 0, 36 / 4];
				gauge.unitsPosition = [halfWidth, sectorWidth + (halfWidth - radiusPin - sectorWidth) / 2, 0, 20 / 4 + 2];
				break;
			case "12":
				gauge.angle = 180;
				gauge.heightViewBox = this.height / 2 + 20;
				gauge.valuePosition = [halfWidth, sectorWidth + (halfWidth - radiusPin - sectorWidth) / 2, 0, 36 / 4 + (this.units ? 0 : 6)];
				gauge.unitsPosition = [halfWidth, halfWidth - radiusPin, 0, - 5];
				break;
		}

		//
		const pointStart = gauge.angle / 2; // Начало сектора
		const pointEnd = 360 - gauge.angle; // Конец сектора
		//
		const valueNorm = this.value < this.minValue ? this.minValue : this.value > this.maxValue ? this.maxValue : this.value; 
		const valueOldNorm = this.valueOld < this.minValue ? this.minValue : this.valueOld > this.maxValue ? this.maxValue : this.valueOld;

		// Деления
		// Риски
		const majorTicksRadius = this.width / 2 - sectorWidth / 2; // Радиус
		const majorTicksCircumference = this.calculateCircumference(majorTicksRadius); // Длина окружности
		const majorAngleToArc = this.mapRange(1, 0, 360, 0, majorTicksCircumference); // Длина окружности в 1 градусе
		
		// Округление
		const valueFixed = this.value.toFixed(this.fixed);

		//
		const angleValue = this.mapRange(valueNorm, this.minValue, this.maxValue, pointStart, 360 - pointStart);
		const angleValueOld = this.mapRange(valueOldNorm, this.minValue, this.maxValue, pointStart, 360 - pointStart);
		//console.log(`${this.value} / ${angleValue}`);

		// Цветные сектора
		// Риски делений
		let majorTicksLine = "0";
		let sectorColors = [];
		if (Array.isArray(this.buiSectorColors)) {
			let fill = 0;
			let k = 0;
			for (const [start, end, color] of this.buiSectorColors) {
				let startNorm = 0;
				if (start >= this.minValue && start <= this.maxValue) {
					startNorm = start;
				} else if (start < this.minValue) {
					startNorm = this.minValue;
				} else if (start > this.maxValue) {
					startNorm = this.maxValue;
				}
				let endNorm = 0;
				if (end >= this.minValue && end <= this.maxValue) {
					endNorm = end;
				} else if (end < this.minValue) {
					endNorm = this.minValue;
				} else if (end > this.maxValue) {
					endNorm = this.maxValue;
				}
				if (startNorm >	endNorm) {
					startNorm = endNorm;
				}
				const fillStart = this.mapRange(startNorm, this.minValue, this.maxValue, pointStart, 360 - pointStart); // Начало сектора
				const fillEnd = this.mapRange(endNorm, this.minValue, this.maxValue, pointStart, 360 - pointStart); // Конец сектора
				sectorColors.push([fillStart, fillEnd, color]);
				//
				//console.log(`${fillStart}`);
				majorTicksLine += ` ${(fillStart - fill) * majorAngleToArc - k} ${widthTicksLine}`;
				fill = fillStart;
				k = widthTicksLine;
			}
		}
		majorTicksLine += ` ${majorTicksCircumference}`;
		// (halfWidth + radiusPin) + ((this.width - sectorWidth) - (halfWidth + radiusPin) / 2)
		//console.log(((this.width - sectorWidth) - (halfWidth + radiusPin)) / 2);

		return html`
		<svg viewBox="0 0 ${this.width} ${gauge.heightViewBox}">
			<!--<polygon points="0,0 ${this.width},0 ${this.width},${this.width} 0,${this.width}" stroke-width="0" fill="#000"/>
			<circle
				cx="${halfWidth}"
				cy="${halfWidth}"
				r="${majorTicksRadius}"
				stroke-dasharray="0 ${pointStart * majorAngleToArc} ${pointEnd * majorAngleToArc} ${majorTicksCircumference}"
				stroke="#fff"
				stroke-width="${sectorWidth}"
				fill="none"
				transform="rotate(90 ${halfWidth} ${halfWidth})"
				stroke-opacity="0.8"
			/>-->
			<!-- Цветные сектора -->
			<g id="gauge-sections" fill="none" stroke-width="${sectorWidth}" transform="rotate(90 ${halfWidth} ${halfWidth})">
				${sectorColors.map(
					(item) => svg`
						<circle
							cx="${halfWidth}"
							cy="${halfWidth}"
							r="${majorTicksRadius}"
							stroke-dasharray="0 ${item[0] * majorAngleToArc} ${(item[1] - item[0]) * majorAngleToArc} ${majorTicksCircumference}"
							stroke="${item[2]}"
						/>
					`
				)}
			</g>
			<g id="gauge-scale" transform="rotate(90 ${halfWidth} ${halfWidth})">
				<!-- Риски -->
				<circle
					cx="${halfWidth}"
					cy="${halfWidth}"
					r="${majorTicksRadius}"
					stroke-width="${sectorWidth}" 
					stroke-dasharray="${majorTicksLine}"
					stroke-dashoffset="1"
					stroke="var(--color-gray-50)"
					fill="none"
					stroke-opacity="1"
				/>
				<!-- Стрелка -->
				<polygon
					id="hand"
					points="${halfWidth},${halfWidth + sectorWidth / 4} ${this.width - sectorWidth / 2},${halfWidth} ${halfWidth},${halfWidth - sectorWidth / 4} ${halfWidth - sectorWidth / 2},${halfWidth - 3} ${halfWidth - sectorWidth / 2},${halfWidth + 3}"
					fill="var(--color-red-300)"
					stroke-width="1"
					stroke="var(--color-gray-800)"
					stroke-opacity="0.3"
					fill-opacity="0.8"
					transform="rotate(${angleValue} ${halfWidth} ${halfWidth})"
				/>
				<animateTransform
					id="anim-hand"
					href="#hand"
					attributeName="transform"
					type="rotate"
					begin="0s"
					dur="1s"
					restart="whenNotActive"
					from="${angleValueOld} ${halfWidth} ${halfWidth}"
					to="${angleValue} ${halfWidth} ${halfWidth}"
					additive="replace"
					fill="freeze"
				/>
				<!-- Гвоздик -->
				<circle
					cx="${halfWidth}"
					cy="${halfWidth}"
					fill="var(--color-gray-800)"
					r="${radiusPin}"
					stroke-width="1" 
					stroke="var(--color-gray-400)"
				/>
				<!-- Маска выреза -->
				<mask id="mask-gauge" fill="#fff">
					<circle
						cx="${halfWidth}"
						cy="${halfWidth}"
						r="${majorTicksRadius}"
						stroke-dasharray="0 ${(pointStart - 0.5) * majorAngleToArc} ${(pointEnd + 1) * majorAngleToArc} ${majorTicksCircumference}"
						stroke="#fff"
						stroke-width="${sectorWidth + 1}"
						fill="none"
					/>
				</mask>
			</g>

			<!-- Текущее значение в цифре -->
			${this.visibleValueOff ? `` : svg`
			<g fill="var(--bui-widget-color)">
				<text x="${gauge.valuePosition[0]}" y="${gauge.valuePosition[1]}" dx="${gauge.valuePosition[2]}" dy="${gauge.valuePosition[3]}" text-anchor="middle" class="value">${valueFixed}</text>
				<text x="${gauge.unitsPosition[0]}" y="${gauge.unitsPosition[1]}" dx="${gauge.unitsPosition[2]}" dy="${gauge.unitsPosition[3]}" text-anchor="middle" class="units">${this.units}</text>
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

				<line x1="0" y1="${sectorWidth}" x2="${this.width}" y2="${sectorWidth}" stroke="orange"/>
				<line x1="0" y1="${halfWidth - radiusPin}" x2="${this.width}" y2="${halfWidth - radiusPin}" stroke="orange"/>
				<line x1="0" y1="${sectorWidth + (halfWidth - radiusPin - sectorWidth) / 2}" x2="${this.width}" y2="${sectorWidth + (halfWidth - radiusPin - sectorWidth) / 2}" stroke="red"/>

				<line x1="0" y1="${halfWidth + radiusPin}" x2="${this.width}" y2="${halfWidth + radiusPin}" stroke="orange"/>
				<line x1="0" y1="${this.width - sectorWidth}" x2="${this.width}" y2="${this.width - sectorWidth}" stroke="orange"/>
				<line x1="0" y1="${(halfWidth + radiusPin) + ((this.width - sectorWidth) - (halfWidth + radiusPin)) / 2}" x2="${this.width}" y2="${(halfWidth + radiusPin) + ((this.width - sectorWidth) - (halfWidth + radiusPin)) / 2}" stroke="red"/>
			</g>
		</svg>
		`;
	}

	get animateHand() {
		return this.renderRoot?.querySelector('#anim-hand') ?? null;
	}

	render() {
		const toRender = this.gaugeCircle2();

		this.valueOld = this.value;

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
			if (this.animateHand) {
				this.animateHand.beginElement();
			}
		}
	}

}
customElements.define('bui-gauge-circle-2', BUIGaugeCircle2);
