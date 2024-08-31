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