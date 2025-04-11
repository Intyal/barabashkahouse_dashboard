/*
<bui-tab slot="nav" role="tab" page="bui_c89d38dccaabc137"></bui-tab>

Атрибуты:
	slot			- "nav"
	role			- "tab"
	page			- id тега bui-page-grid
Свойства:

*/

import { LitElement, html, css } from '../lit-core.min.js';

export class BUITab extends LitElement {
	static properties = {
		page: { type: String },
		role: { type: String },
	};

	static styles = css`
	:host
	{
		margin-top: 6px;
		margin-bottom: 6px;
		margin-left: 15px;
		margin-right: 15px;
		font-family: var(--bui-font-family, var(--default-font-family));
		font-size: 2em;
		color: var(--bui-tab-color);
	}
	:host([active]) {
		/* Чтобы перебить заданный цвет иконки при активной вкладке задаем переменную */
		--color: var(--bui-tab-color-active);
		color: var(--bui-tab-color-active);
	}
	.tab {
		display: ruby;
		font-size: var(--font-size);
		font-variant: small-caps;
	}
  `;

	constructor() {
		super();
		//this.addEventListener('click', (e) => console.log(e.type, e.target.localName));
		//this.addEventListener('click', () => { this.openTab(); });
	}

	firstUpdated() {
		if (this.role == 'tab') {
			this.addEventListener('click', () => { this.openTab(); });
		}
	}

	render() {
		if (window.localStorage.getItem('selectedPage') === this.page) {
			//document.querySelector(`[page="${this.page}"]`).setAttribute("active","");
			this.openTab();
		}

		return html`
			<slot class="tab"></slot>
    	`;
	}

	openTab(e) {
		// Скрываем все страницы
		let pages = document.querySelectorAll('[role="page"]');
		for (let i = 0; i < pages.length; i++) {
			pages[i].removeAttribute("active");
		}

		// Удаляем активный класс у всех кнопок
		let tabs = document.querySelectorAll('[role="tab"]');
		for (let i = 0; i < tabs.length; i++) {
			tabs[i].removeAttribute("active");
		}

		// Показываем нужную страницу
		document.getElementById(this.page).setAttribute("active","");
		document.querySelector(`[page="${this.page}"]`).setAttribute("active","");
		// Записываем выбранную страницу в localStorage
		window.localStorage.setItem('selectedPage', this.page);
	}

}
customElements.define('bui-tab', BUITab);
