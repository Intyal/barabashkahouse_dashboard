/*
<bui-button size="2" topic="zigbee2mqtt/power_switch_hall/state_left" value="OFF"></bui-button>

Атрибуты:
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload,
							topic, на который отправляется новое значение
	[uib]value		- число, или значение из msg.payload
	[uib]valueSet	- значение для установки в topic
Свойства:
	[uib]buiStates	- массив из статусов ["ON", "OFF",].
					value сравнивается с статусами и при совпадении отправляется статус, следующий за найденным.

valueSet имеет приоритет, при его отсутствии применяется значение из buiStates.
*/

import { LitElement, css } from '../lit-core.min.js';

export class BUIClick extends LitElement {
	static properties = {
		valueSet: { attribute: 'value-set', type: String },
		value: { type: String },
		topic: { attribute: 'topic' },
		buttonID: { attribute: 'button-id', type: String },
	};

	static styles = css`
	:host {
		display: none;
	}
	`;

	constructor() {
		super();
	}

	firstUpdated() {
		//console.log(this.buttonID);

		const parentElement = document.getElementById(this.buttonID);
		if (parentElement) {
			parentElement.addEventListener('click', () => { this.toggleStatus(); });
			//parentElement.setAttribute("click", "");
		}
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

	toggleStatus() {
		//window.navigator.vibrate([100, 100]);
		this.beep(100, 200, 1, "sine");

		// Если установлено valueSet, отправить его в MQTT,
		// иначе использовать как переключатель
		if (this.valueSet) {
			console.log(this.valueSet);
			uibuilder.send({
					topic: this.topic,
					uibuilderCtrl: "mqtt set",
					payload: this.valueSet,
			});
		} else if (Array.isArray(this.buiStates)) {
			// Ищем индекс текущего значения переключателя в массиве состояний
			let findIndex = this.buiStates.indexOf(this.value);
			// Увеличиваем индекс до следующего элемента
			// Если значение не найдено, и вернулось -1, установится состояние с индексом 0
			findIndex ++;

			console.log(this.buiStates.length == findIndex ? this.buiStates[0] : this.buiStates[findIndex]);
			uibuilder.send({
					topic: this.topic,
					uibuilderCtrl: "mqtt set",
					payload: this.buiStates.length == findIndex ? this.buiStates[0] : this.buiStates[findIndex],
			});
		}
	}

}
customElements.define('bui-click', BUIClick);
