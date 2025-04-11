/* Пример

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUISwitch extends LitElement {
	static properties = {
		value: { type: String },
		states: {
			converter: attrValue => {
				return attrValue.split(",")
			}
		},
		topic: { attribute: 'topic' },
		valuesOn: {attribute: 'values-on'},
		valuesOff: {attribute: 'values-off'},
		checked: {type: Boolean},
	};

	static styles = css`
	.bubble {
		min-height: 18px;
		background-color: var(--bui-widget-label-color);
		background-image:
			radial-gradient(closest-side, transparent 20%, var(--bui-widget-background-color) 50%),
			radial-gradient(closest-side, transparent 30%, hsl(0deg 0% 0%) 70%);
		background-size: calc(var(--bui-background-cell-size)/4) calc(var(--bui-background-cell-size)/4);
		background-position: 2px 2px, 0px 0px;
	}
	.bubble:active {
		background-position: 2px 1px, 0px 0px;
	}
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
		/*
		if (this.value) {
			if (this.valuesOn.includes(this.value.toLowerCase())) {
				_state = "on";
			} else if (this.valuesOff.includes(this.value.toLowerCase())) {
				_state = "off";
			}
		}
		*/
		if (this.value) {
			if (this.states[0] == this.value) {
				_state = "on";
			} else if (this.states[1] == this.value) {
				_state = "off";
			}
		}		
		
		return html`
			<div class="bubble" @click=${this.toggleStatus}></div>
			<div class="led ${_state}"></div>
    	`;
	}

	//All arguments are optional:
	//duration of the tone in milliseconds. Default is 500
	//frequency of the tone in hertz. default is 440
	//volume of the tone. Default is 1, off is 0.
	//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
	//callback to use on end of tone
	beep(duration, frequency, volume, type, callback) {
		//if you have another AudioContext class use that one, as some browsers have a limit
		let audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
		let oscillator = audioCtx.createOscillator();
		let gainNode = audioCtx.createGain();
		
		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);
		
		if (volume){gainNode.gain.value = volume;}
		if (frequency){oscillator.frequency.value = frequency;}
		if (type){oscillator.type = type;}
		if (callback){oscillator.onended = callback;}
		
		oscillator.start(audioCtx.currentTime);
		oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
	}

	toggleStatus(e) {
		//window.navigator.vibrate([100, 100]);
		this.beep(100, 200, 1, "sine");

		//uibuilder.eventSend(e);
		uibuilder.send(
			{
				topic: this.topic,
				uibuilderCtrl: "mqtt set",
				payload: this.value == this.states[0] ? this.states[1] : this.states[0],
			}
		);
		//console.log(e);
	}

}
customElements.define('bui-switch', BUISwitch);
