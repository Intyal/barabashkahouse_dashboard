/*
<bui-string size="1.6" color="blue">Температура</bui-string>

Атрибуты:
	size			- Размер шрифта в rem
	color			- Цвет текста
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIString extends LitElement {
	static properties = {
		size: { type: String },
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
		justify-content: var(--justify-content);
    	align-items: center;

		font-size: var(--font-size);
	}
	.value {
		color: var(--color);
		line-height: 0.75;
		letter-spacing: -0.025em;
	}
	`;

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="value"><slot></slot></div>
    	`;
	}

}
customElements.define('bui-string', BUIString);
