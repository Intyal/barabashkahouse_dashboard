/*
<bui-button size="2" topic="zigbee2mqtt/power_switch_hall/state_left" value="OFF"></bui-button>

Атрибуты:
	size			- высота кнопки в линиях
	[uib]topic	- Указывается при каком msg.topic, в атрибут value присвоется msg.payload,
							topic, на который отправляется новое значение
	[uib]value		- число, или значение из msg.payload
	[uib]valueSet	- значение для установки в topic
Свойства:
	[uib]buiStates	- массив из статусов ["ON", "OFF",].
					value сравнивается с статусами и при совпадении отправляется статус, следующий за найденным.

valueSet имеет приоритет, при его отсутствии применяется значение из buiStates.
*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUIButton extends LitElement {
	static properties = {
		size: { type: Number },
		valueSet: { attribute: 'value-set', type: String },
		value: { type: String },
		topic: { attribute: 'topic' },
	};

	static styles = css`
	:host {
		display: contents;
	}
	.bubble {
		width: 100%;
		background-color: var(--bui-widget-color);
		background-image:
			radial-gradient(closest-side, transparent 20%, var(--bui-widget-background-color) 50%),
			radial-gradient(closest-side, transparent 30%, hsl(0deg 0% 0%) 70%);
		background-size: 8px 8px;
		background-position: 2px 2px, 0px 0px;
	}
	.button {

	}
	.bubble:active {
		background-position: 2px 1px, 0px 0px;
	}
	`;

	constructor() {
		super();
		//this.addEventListener('click', (e) => console.log(e.type, e.target.localName));
		//this.size = 3;
	}

	render() {
		const size = this.size * 8;
		const debouncedToggleStatus = this.debounce(this.toggleStatus, 500);
		
		return html`
			<slot @click=${debouncedToggleStatus}></slot>
			${size ? html`<div class="bubble" style="min-height: ${size}px;" @click=${debouncedToggleStatus}></div>` : ''}
    	`;
	}

	// Функция «антидребезг» — это метод предотвращения многократной активации
	// функции при быстрой последовательности событий.
	// Она работает, откладывая выполнение функции до тех пор,
	// пока не пройдёт определённый период без срабатывания события.
	debounce(func, delay) {
		let timeout;
		return function() {
			const context = this;
			const args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(context, args), delay);
		};
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

		// Если установлено valueSet, отправить его в MQTT,
		// иначе использовать как переключатель
		if (this.valueSet) {
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

			uibuilder.send({
					topic: this.topic,
					uibuilderCtrl: "mqtt set",
					payload: this.buiStates.length == findIndex ? this.buiStates[0] : this.buiStates[findIndex],
			});
		}
	}

}
customElements.define('bui-button', BUIButton);
