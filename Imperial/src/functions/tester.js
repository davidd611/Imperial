require('colors'); const fs = require('fs'), process = require('process');

let date = new Date();
let file = '';
// FECHA Y ESTRUCTURA--------------------------------------------------------------------------------
function getDate() {   
  return '[AA_MM_DD][HH-MM-SS]'
  .replace('AA_MM_DD', `${date.getUTCDay()}_${date.getUTCMonth()+1}_${date.getUTCFullYear()}`)
  .replace('HH-MM-SS', `${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}`)
}
function estructurar() {
  return `${getDate().replace(/_/g, '/').replace(/-/g, ':')} [type][by] [message] args`.toUpperCase();
}

function mensaje(type, by, message, continuar, args) {
  let res = estructurar()
  .replace('type'.toUpperCase(), type.toUpperCase())
  .replace('by'.toUpperCase(), by.toUpperCase())
  .replace('message'.toUpperCase(), message)
  if (continuar === true) {
    res = res.replace('args'.toUpperCase(), args)
  } else { res = res.replace('args'.toUpperCase(), '') }
  return res;
}

// MANEJO DE ERRORES---------------------------------------------------------------------------------

require('./errores')

// REGISTRO------------------------------------------------------------------------------------------
function establecer() {
  if (file.length <= 0) { 
    file = `${getDate().replace(/_/g, '-')}.log`; 
    info('informer', 'Nombre de archivo establecido', true, file, 'cyan', true); 
  }
}

function eliminar(objDir) { fs.rmSync(objDir) }

function buscarParaAtras(obj, entrar, archivo) {
  let res, objPath = './', estado = 'desconocido';
  
  while (estado === 'desconocido') {
    let dir = fs.readdirSync(objPath);
    let find = dir.find(o => o === obj)
    if (find === obj) { estado = 'conocido'; }
    
    else { objPath += '../' }
    
  } res = objPath + obj + '/';

  if (entrar === true) {
    let find = fs.readdirSync(res).filter(o => o.endsWith('.log'))
    if (find[0] === archivo) { res += find[0]; }
    else {
      for (f of find) {
        eliminar(`${res}${f}`)
      }
    }
  }
  return res;
}

async function enviar(obj, entrar, archivo, data) {
  let log = buscarParaAtras(obj, entrar, archivo);
  if (!log.endsWith(archivo)) log += archivo
  fs.appendFile(`${log}`, `${data}\n`, 'utf8', e => { if (e !== null) error('enviar', e) });
}

// SALIDA--------------------------------------------------------------------------------------------

function simplificar(value, underline) {
  let colores = [
    ' '.black,
    ' '.blue,
    ' '.cyan,
    ' '.gray,
    ' '.green,
    ' '.grey,
    ' '.magenta,
    ' '.red,
    ' '.white,
    ' '.yellow
  ]
  let res = value
  colores.map(c => { 
    let cols = c.split(' ');
    cols.map(i => {
      let tiene = false, intento = 0, find = res.includes(i); if (find === true) tiene = true;
      while (tiene === true) {
        res = res.replace(i, ''); if (intento >= 25) { tiene = false; intento = 0 } else intento++
      }
    });
  });
  if (underline === true) {
    ' '.underline.split(' ').map(i => {
      let tiene = false, intento = 0, find = res.includes(i); if (find === true) tiene = true;
      while (tiene === true) {
        res = res.replace(i, ''); if (intento >= 15) { tiene = false; intento = 0 } else intento++;
      }
    });
  }
  return res
}
function colorear(value, color, underline) { 
  const colores = {
    black: value.black,
    blue: value.blue,
    cyan: value.cyan,
    gray: value.gray,
    green: value.green,
    grey: value.grey,
    magenta: value.magenta,
    red: value.red,
    white: value.white,
    yellow: value.yellow
  }
  let res = value;
  if (colores[color] === undefined || null) res = value; else res = colores[color]
  if (underline === true) res = res.underline;
  return res
}

async function preparar (type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) {
  establecer()
  enviar('log', true, file, simplificar(mensaje(type, by, message, continuar, args), true));
  let fecha = estructurar().replace('[type][by] [message] args'.toUpperCase(), '')
  let res

  let out1 = mensaje(type.toUpperCase(), '', '')
  .replace(fecha.split('][')[0].split('[')[1], colorear(fecha.split('][')[0].split('[')[1], 'gray', false))
  .replace(fecha.split('][')[1].split(']')[0], colorear(fecha.split('][')[1].split(']')[0], 'gray', false))
  .replace(type.toUpperCase(), colorear(type.toUpperCase(), color1))
  .replace('[] ', '').replace('[] ', '');

  let out2 = mensaje('', by.toUpperCase(), message)
  .replace(`${fecha}`, '').replace(`[]`, '')
  .replace(by.toUpperCase(), colorear(by.toUpperCase(), color2))
  .replace(message, colorear(message, color3, underline1));

  let out3 = mensaje('', '', '', continuar, args)
  .replace(`${fecha}`, '').replace(`[][] [] `, '')
  .replace(args, colorear(`${args}`, color4, underline2));
  res = out1 + out2 + out3;
  console.log(res);
}



function error(by, message, continuar, args, color, underline) { preparar('error', 'red', by, '', message, '', false, continuar, args, color, underline) }
function info(by, message, continuar, args, color, underline) { preparar('info', 'magenta', by, '', message, '', false, continuar, args, color, underline) }
function warn(by, message, color, underline, continuar, args, color1, underline1) { preparar('warning', 'yellow', by, '', message, color, underline, continuar, args, color1, underline1) }
function log(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) { preparar(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) }

module.exports = { error, info, warn, log, colorear, preparar, buscarParaAtras, eliminar, getDate, estructurar}

// Desde index.js - bot no cambia, pero desde ready - events. sí cambia
// podría ser que esta haciendo una lectura entre busqueda de archivo y eliminandolo?
// si es así, como lo puedo solucionar?
// porque si el error es causado en - enviar - y >- buscarParaAtras -<, se aclaran muchas cosas
// Solucionado, - buscarParaAtras - era el causante de eliminación y creación al estar listo el cliente
//-----------------------------------------------------------------------------------------------------
// Todo terminado, se logro terminar el sistema de registro, a partir de ahora no entraran colores en
// el archivo .log
