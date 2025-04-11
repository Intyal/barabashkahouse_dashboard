/*
<bui-string size="1.6" color="blue">Температура</bui-string>

Атрибуты:
	size			- Размер шрифта в rem
	color			- Цвет текста
Свойства:

*/

import { LitElement, css } from '../lit-core.min.js';

export class BUILastTime extends LitElement {
	static properties = {
		format: { type: String },
		topic: { attribute: 'topic' },
		valueID: { attribute: 'value-id', type: String },
	};

	static styles = css`
	:host {
		display: none;
	}
	`;

	constructor() {
		super();

		//const intervalId = setInterval(this.getLastTime, 60000); // 60000 миллисекунд = 1 минута
		const intervalId = setInterval(() => { this.getLastTime(); }, 60000);
	}

	async getLastTime() {
		let result = await bui_indexedDB.get("topics", this.topic);
		if (result) {
			const parentElement = document.getElementById(this.valueID);
			const timeRemainSec = parseInt((Date.now() - Date.parse(result.date)) / 1000);

			let strRemain = "";
			if (timeRemainSec < 60) {
				strRemain = "<1м";
			} else if (timeRemainSec < 60 * 60) {
				const minutes = Math.floor(timeRemainSec / 60);
				strRemain = `${minutes}м`;
			} else {
				const hours = Math.floor(timeRemainSec / 60 / 60);
    			strRemain = `${hours}ч`;
			}

			parentElement.innerText = strRemain;
			console.log(strRemain);
		}
	}

}
customElements.define('bui-lasttime', BUILastTime);
