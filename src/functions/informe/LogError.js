const process = require('process');
const LogEntry = require('./LogEntry');
const Mensaje = new LogEntry()
process.on('uncaughtException',err => { Mensaje.error('manager0', err.message, true, err.stack); process.exit() })
process.on('rejectionHandled', err =>  Mensaje.error('manager1', err.message, true, err.stack))
process.on('unhandledRejection', err => Mensaje.error('manager2', err.message, true, err.filename))
process.on('message', err => Mensaje.error('manager3', err.message, true, err.stack)) 