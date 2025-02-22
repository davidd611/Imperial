const discord = require('discord.js');

module.exports = {
	/**
	 * 
	 * @param {discord.Client} client 
	 * @param {discord.Message} message 
	 * @param {string[]} args 
	 */
	run: (client, message, args) => {}
}
/*
const db = [ { ip: "mc.galaxyorigins.net" } ];
function getDB() { return db }

function getall() {
	let res;
	const elementList = { position: [], ip: [], name: [], modpack: [], version: [] }
	const elements = getDB()
	if (elements.length > 0) {
		elements.map((element) => {
			elementList.position.push(elements.indexOf(element))
			for (const property in element) { elementList[property].push(element[property]) }
		})
		res = { code: 500, message: "Se obtuvo la lista de elementos exitosamente", content: elementList }
	} else { res = { code: 404, message: "La lista está vacia" } }
	return res;
}
function getSEProps(position) {
	let res;
	const element = getDB()[position];
	if (element !== undefined) {
		res = { code: 500, message: "Se obtuvo la lista de propiedades exitosamente", content: element }
	} else res = { code: 404, message: "El elemento no existe" }
	return res;
}
function getSEProp(position, property) {
	let res;
	const element = getSEProps(position);
	if (element.code !== 404) {
		const elemProp = element.content[property];
		if (elemProp !== undefined) {
			res = { code: 500, message: "Se obtuvo la lista de propiedades exitosamente", content: elemProp }
		} else res = { code: 404, message: "La propiedad no existe" }
	} else res = element;
	return res;
}

function add(property, value) {
	let res;
	const elements = getDB();
	const template = { ip: "", name: "", modpack: "", version: "" }
	if (property !== undefined) {
		if (template[property] !== undefined) {
			template[property] = value??null;
			elements.push(template);
			const newElements = getall().content;
			res = { code: 500, message: "Se añadio el elemento a la lista exitosamente", content: newElements }
		} else res = { code: 110, message: "La propiedad de elemento no es valida" };
	} else res = { code: 100, message: "No se ha definido - property -" }
	return res;
}
function edit(position, property, value) {
	let res;
	function SURE(v) { res = { code: 100, message: `- ${v} - no fue definido` } }
	if (position !== undefined) {
		if (property !== undefined) {
			if (value !== undefined) {
				const elements = getDB();
				elements[position][property] = value;
				const elementsUpdated = getall().content
				res = { code: 500, message: "La propiedad de el elemento fue modificada exitosamente", content: elementsUpdated }
			} else SURE("value");
		} else SURE("property");
	} else SURE("position");
	return res;
}

function chooseProperty(property) {}
console.log(add("ip", "duh"))
console.log(getall())
*/

































/*
const { setInterval } = require('timers'); require('colors')
const arr = [];

function setTime(array, time, message) { array.push({ time: time, message: message }) }
function sendMessageAtTime(array) {
	array.map((object) => {
		console.log(object)
		const objectTime = object.time.split(':');
		if (!'time' in object && !'message' in object) console.log('- time - or - message - is missing');
		let ready = false;
		while (ready === false) {
			const date = new Date();
			const time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
			if (time === object.time) {
				console.log(`[${time}] [${object.message}] `);
				ready = true;
			} else if (date.getUTCHours() < objectTime[0]) {
				console.log(`Todavia no es la hora, son las [${time.green}] y el momento acordado es [${object.time.green}]`);
			} else if (date.getUTCMinutes() < objectTime[1]) {
				console.log(`Todavia no es el minuto, son las [${time.green}] y el momento acordado es [${object.time.green}]`);
			}
	  }
	});
}


setTime(arr, "17:30", "mensaje_12")
setTime(arr, "17:31", "mensaje_13")
sendMessageAtTime(arr);
console.log('bueh')
*/



/*

async function sendMessageAtTime(array) {
	array.map((object) => {
		console.log(object)
		const objectTime = object.time.split(':');
		if (!'time' in object && !'message' in object) console.log('- time - or - message - is missing');
		let ready = false;
		async function bucle(condition) {
			if (condition === false) {
				const date = new Date();
				const time = `${date.getUTCHours()}:${date.getUTCMinutes()}`;
				if (time === object.time) {
					console.log(`[${time}] [${object.message}] `);
					ready = true;
				} else if (date.getUTCHours() < objectTime[0]) {
					console.log(`Todavia no es la hora, son las [${time.green}] y el momento acordado es [${object.time.green}]`);
				} else if (date.getUTCMinutes() < objectTime[1]) {
					console.log(`Todavia no es el minuto, son las [${time.green}] y el momento acordado es [${object.time.green}]`);
				}
				bucle(condition)
	  	}
		}
		bucle(ready)
	});
}

module.exports = {
	run: async() => {}
}*/