/*
<bui-group style="--direction: column"></bui-group>

Атрибуты:
	style
		--direction	- column или row, расположение элементов внутри группы
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIGroup extends LitElement {
	static properties = {

	};

	static styles = css`
	:host {
		--direction: row;
		box-sizing: border-box; /* Свойство box-sizing: border-box, добавит поля, отступы и границы вовнутрь блока */
		display: flex;
		flex-direction: var(--direction);
		flex-wrap: wrap;
		/*flex-grow: 1;*/
		gap: 2px;

	}
	`;

	constructor() {
		super();
	}

	render() {
		return html`
		<slot></slot>
    	`;
	}

}
customElements.define('bui-group', BUIGroup);
