/* Пример
https://fonts.google.com/icons?icon.size=24&icon.color=%23e8eaed&icon.style=Rounded
*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIIconG extends LitElement {
	static properties = {
		size: { type: Number },
		color: { type: String },
	};

	static styles = css`
	:host {
		align-self: center;
	}
	.material-icons-outlined {
		font-family: 'Material Icons Outlined';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;  /* Preferred icon size */
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;

		/* Support for all WebKit browsers. */
		-webkit-font-smoothing: antialiased;
		/* Support for Safari and Chrome. */
		text-rendering: optimizeLegibility;

		/* Support for Firefox. */
		-moz-osx-font-smoothing: grayscale;

		/* Support for IE. */
		font-feature-settings: 'liga';
	}
	`;

	constructor() {
		super();
	}

	render() {
		const _style = [];
		if (this.color) _style.push(`color: ${this.color}`);
		if (this.size) _style.push(`font-size: ${this.size}px`);

		return html`
			<slot class="material-icons-outlined" style="${_style.join(";")}"></slot>
    	`;
	}

}
customElements.define('bui-icon', BUIIconG);
