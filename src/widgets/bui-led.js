/*
<bui-led color="lime"></bui-led>

Атрибуты:
	size			- высота.
	color			- CSS цвет.
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload.
	[uib]value		- значение из msg.payload.
Свойства:
	[uib]buiRanges	- массив из массивов [["ON","var(--color-lime-600)"],["OFF","var(--color-orange-300)"]].
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
    	align-items: center;

		font-size: var(--font-size);
	}
	.content {
		flex: 1;
		max-width: var(--sizex, 90%);
		min-height: var(--sizey, 90%);
		/*max-height: 100%;*/
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
			const br = this.rgbToHsl(rgb).l / 100;
			this.style.setProperty('--shadow', `0 ${parseInt(5 * br)}px ${parseInt(10 + 15 * br)}px ${parseInt(6 * br)}px var(--color)`);
		}
		
		return html`
			<div class="content"></div>
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

	rgbToHsl(rgb) {
		let r = parseInt(rgb.slice(4, -1).split(',')[0]) / 255;
		let g = parseInt(rgb.slice(4, -1).split(',')[1]) / 255;
		let b = parseInt(rgb.slice(4, -1).split(',')[2]) / 255;
		
		let max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;
  
		if (max === min) {
		  h = s = 0; // achromatic
		} else {
		  var d = max - min;
		  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		  
		  switch(max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		  }
		  h /= 6;
		}
  
		return {h: h * 360, s: s * 100, l: l * 100};
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