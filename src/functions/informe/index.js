const DateText = require('./DateText');
const LogColor = require('./LogColor');
const LogEntry = require('./LogEntry');



//require('./LogError');

/*
const process = require('process');
process.on('uncaughtException', err => error('manager0', err.message, true, err.stack))
process.on('rejectionHandled', err =>  error('manager1', err.message, true, err.stack))
process.on('unhandledRejection', err => error('manager2', err.message, true, err.stack))
process.on('message', err => error('manager3', err.message, true, err.stack)) 

function error(by, message, continuar, args, color, underline) { preparar('error', 'red', by, '', message, '', false, continuar, args, color, underline) }
function info(by, message, continuar, args, color, underline) { preparar('info', 'magenta', by, '', message, '', false, continuar, args, color, underline) }
function warn(by, message, color, underline, continuar, args, color1, underline1) { preparar('warning', 'yellow', by, '', message, color, underline, continuar, args, color1, underline1) }
function log(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) { preparar(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) }
*/
module.exports = {
  DateText: new DateText(),
  LogColor: new LogColor(),
  LogEntry: new LogEntry(),
}
