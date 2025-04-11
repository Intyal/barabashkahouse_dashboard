'use strict'

/** Minimalist code for uibuilder and Node-RED using ESM
 * logLevel and showMsg can be controlled from Node-RED instead of here if preferred.
 *
 * Note that you need to understand a bit about how ESM's work
 * or you will get caught out! This is not a uibuilder issue.
 * Script files loaded as a module have no access to other scripts
 * unless imported here.
 */

import '../uibuilder/uibuilder.esm.min.js';  // Adds `uibuilder` and `$` to globals

//
// Установка PWA приложения
// https://pwa-workshop.js.org/5-pwa-install/#installing-the-pwa
//
let deferredPrompt; // Allows to show the install prompt
const installButton = document.getElementById("install_button");

function installApp() {
	// Show the prompt
	deferredPrompt.prompt();
	installButton.disabled = true;

	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then(choiceResult => {
		if (choiceResult.outcome === "accepted") {
			console.log("PWA setup accepted");
			installButton.hidden = true;
		} else {
			console.log("PWA setup rejected");
		}
		installButton.disabled = false;
		deferredPrompt = null;
	});
}
window.addEventListener("beforeinstallprompt", e => {
	// Prevent Chrome 76 and earlier from automatically showing a prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Show the install button
	installButton.hidden = false;
	installButton.addEventListener("click", installApp);
});
// -----------------------------------------------------

// Создание Воркера
// const worker = new Worker("worker.js");
// // This event is fired when the worker posts a message
// // The value of the message is in messageEvent.data
// worker.addEventListener("message", function(messageEvent) {
// 	// Log the received message in the output element
// 	console.log(messageEvent.data);
// });
// -----------------------------------------------------


const configIDB = {
	dbName: 'node-red-uib',
	version: 1,
	storeConfig: [{
		name: "topics",
		keyPath: "topic",
		autoIncrement: false,
	},
	]
};

window.bui_indexedDB = await jsIndexedDB(configIDB);

// logLevel 2+ shows more built-in logging. 0=error,1=warn,2=info,3=log,4=debug,5=trace.
// uibuilder.set('logLevel', 2) // uibuilder.set('logLevel', 'info')
// Using the log output yourself:
// uibuilder.log('info', 'a prefix', 'some info', {any:'data',life:42})

// Show the latest incoming msg from Node-RED
uibuilder.showMsg(true, '#page3');

// Helper function to send a message back to Node-RED using the standard send function
// - see the HTML file for use. Can, of course, add any custom data in the msg.
window.fnSendToNR = function fnSendToNR(payload) {
	uibuilder.send({
		'topic': 'msg-from-uibuilder-front-end',
		'payload': payload,
	})
};

// Listen for incoming messages from Node-RED and action
uibuilder.onChange('msg', async (msg) => {
	if (msg.topic) {
		const topic = {
			topic: msg.topic,
			payload: msg.payload,
			date: Date(),
		};
		let result = await bui_indexedDB.update("topics", topic);
		/*
		try {
			await db.add("topics", topic);
		} catch (error) {
			console.log(error);
		}
		*/
	}

	// Поиск элементов с атрибутом topic равным пришедшему значению в msg.topic
	const topicNodes = document.querySelectorAll(`[topic="${msg.topic}"]`);

	if (topicNodes) {
		for (let node of topicNodes) {
			// Присвоение атрибуту value значения из msg.payload
			if (typeof msg.payload !== 'undefined') {
				node.setAttribute('value', msg.payload);
			}
			// Если есть атрибут color, меняем цвет
			if (msg.color) {
				//node.setAttribute('color', msg.color);
			}

			//console.log(msg.payload);
			//let parentNode = oldNode.parentNode;
			//parentNode.replaceChild(oldNode, oldNode)
			//console.log(parentNode);
		}
	}
});

// Свайп между страницами
document.addEventListener('DOMContentLoaded', function () {
	// Проверяем, поддерживается ли сервисный работник в браузере
	// Если да, регистрируем сервисный работник
	// if ("serviceWorker" in navigator) {
	// 	navigator.serviceWorker
	// 		.register("worker.js")
	// 		.then(serviceWorker => {
	// 		console.log("Service Worker registered: ", serviceWorker);
	// 		})
	// 		.catch(error => {
	// 		console.error("Error registering the Service Worker: ", error);
	// 		});
	// 	}


	const element = document.querySelector('bui-book'); // Элемент, на котором будем отслеживать свайпы

	let startX;
	let endX;

	element.addEventListener('touchstart', function (event) {
		startX = event.touches[0].pageX;
	});

	element.addEventListener('touchend', function (event) {
		endX = event.changedTouches[0].pageX;

		if (startX && endX) {
			const diff = endX - startX;
			const pages = document.querySelectorAll(`bui-tab[role="tab"]`);
			const page_active = document.querySelector('bui-tab[active]');

			let page_prev = "";
			let page_next = "";

			for (let i = 0; i < pages.length; i++) {
				if (pages[i].id == page_active.id) {
					if (i == 0) {
						page_prev = pages[pages.length - 1].id;
						page_next = pages[i + 1].id;
					} else if (i == pages.length - 1) {
						page_prev = pages[i - 1].id;
						page_next = pages[0].id;
					} else {
						page_prev = pages[i - 1].id;
						page_next = pages[i + 1].id;
					}
				}
			}

			if (diff > 50) { // Свайп вправо
				const page = document.querySelector('bui-tab[id="' + page_prev + '"]');
				page.click();
			} else if (diff < -50) { // Свайп влево
				const page = document.querySelector('bui-tab[id="' + page_next + '"]');
				page.click();
			}

			startX = null;
			endX = null;
		}
	});
});
