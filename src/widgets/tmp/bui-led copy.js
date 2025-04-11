/* Пример

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUILed extends LitElement {
	static properties = {
		value: { type: String },
		valuesOn: {attribute: 'values-on'},
		valuesOff: {attribute: 'values-off'},
		checked: {type: Boolean},
	};

	static styles = css`
	.led {
		min-height: 10px;
		border-radius: 7px 7px 5px 5px;
		background: hsl(0deg 0% 60% / 60%);;
		box-shadow: 0 5px 10px -1px hsl(0deg 0% 60% / 60%);
		/*border-top: 1px solid  color-mix(in oklab, var(--bui-widget-background-color), var(--sl-color-neutral-0) 15%);*/
		/*border-left: 1px solid  color-mix(in oklab, var(--bui-widget-background-color), var(--sl-color-neutral-0) 25%);*/
		border-bottom: 2px solid color-mix(in oklab, var(--bui-widget-background-color), var(--sl-color-neutral-1000) 10%);
		/*border-right: 1px solid color-mix(in oklab, var(--bui-widget-background-color), var(--sl-color-neutral-1000) 25%);*/
		margin-top: 4px;
	}
	.on {
		background: hsl(80deg 100% 60% / 70%);
		box-shadow: 0 0 25px 6px hsl(120deg 100% 60% / 60%);
	}
	.off {
		background: hsl(14deg 100% 60% / 70%);
		box-shadow: 0 5px 10px -1px hsl(30deg 100% 60% / 60%);
	}
	`;

	constructor() {
		super();
		this.valuesOn = '["on", "1", 1]';
		this.valuesOff = '["off", "0", 0]';
	}

	render() {
		let _state = "";
		if (this.value) {
			if (this.valuesOn.includes(this.value.toLowerCase())) {
				_state = "on";
			} else if (this.valuesOff.includes(this.value.toLowerCase())) {
				_state = "off";
			}
		}
		
		return html`
			<div class="led ${_state}"></div>
    	`;
	}

	toggleStatus() {
		const successBool = window.navigator.vibrate(100);
	}

}
customElements.define('bui-led', BUILed);
