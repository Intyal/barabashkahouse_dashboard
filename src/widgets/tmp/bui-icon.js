/*

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIIcon extends LitElement {
	static properties = {
		iconName: { attribute: 'icon-name', type: String },
		iconSize: { attribute: 'icon-size', type: String },
		iconStyle: { attribute: 'icon-style', type: String },
	};

	static styles = css`
	:host {
		display: flex;
		justify-content: center;
	}
	`;

	constructor() {
		super();
	}

	render() {

		return html`
				<slot><span class="${this.iconStyle} fa-${this.iconName} ${this.iconSize}"></span></slot>
    	`;
	}

}
customElements.define('bui-icon', BUIIcon);
