const fs = require('fs');
const DateText = require('./DateText');
const LogColor = require('./LogColor');
const LogColors = new LogColor()



module.exports = class LogEntry extends DateText {
  constructor() {
    super()
    this.file = '';
    this.LogColors = new LogColor()
    this.LogMessage
  }
  
  
  establecer() {
    if (this.file.length <= 0) {
      this.file = `${this.getDate().replace(/_/g, '-')}.log`; 
      this.info('informer', 'Nombre de archivo establecido', true, this.file, 'cyan', true);
    }
  }
  eliminar(objDir) { fs.rmSync(objDir) }
  buscarParaAtras(obj, entrar, archivo) {
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
        for (const f of find) {
          this.eliminar(`${res}${f}`)
        }
      }
    }
    return res;
  }
  async enviar(obj, entrar, archivo, data) {
    
    let log = this.buscarParaAtras(obj, entrar, archivo);
    if (!log.endsWith(archivo)) log += archivo
    fs.appendFile(`${log}`, `${data}\n`, 'utf8', e => { if (e !== null) this.error('enviar', e) });
  }
  preparar (type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) {
    let res
    
    this.establecer()
    this.enviar('log', true, this.file, LogColors.simplificar(this.mensaje(type, by, message, continuar, args), true));
    let fecha = this.estructurar().replace('[type][by] [message] args'.toUpperCase(), '')
  
    let tipo = type.toUpperCase();
    let out1 = this.mensaje(tipo, '', '')
    .replace(fecha.split('][')[0].split('[')[1], LogColors.colorear(fecha.split('][')[0].split('[')[1], 'gray', false))
    .replace(fecha.split('][')[1].split(']')[0], LogColors.colorear(fecha.split('][')[1].split(']')[0], 'gray', false))
    .replace(tipo, LogColors.colorear(tipo, color1))
    .replace('[] ', '').replace('[] ', '');
  
    let out2 = this.mensaje('', by.toUpperCase(), message)
    .replace(`${fecha}`, '').replace(`[]`, '')
    .replace(by.toUpperCase(), LogColors.colorear(by.toUpperCase(), color2))
    .replace(message, LogColors.colorear(message, color3, underline1));
  
    let out3 = this.mensaje('', '', '', continuar, args)
    .replace(`${fecha}`, '').replace(`[][] [] `, '')
    .replace(args, LogColors.colorear(`${args}`, color4, underline2));
    res = out1 + out2 + out3;
    console.log(res);
    
  }
  error(by, message, continuar, args, color, underline) { this.preparar('error', 'red', by, '', message, '', false, continuar, args, color, underline) }
  info(by, message, continuar, args, color, underline) { this.preparar('info', 'magenta', by, '', message, '', false, continuar, args, color, underline) }
  warn(by, message, color, underline, continuar, args, color1, underline1) { this.preparar('warning', 'yellow', by, '', message, color, underline, continuar, args, color1, underline1) }
  log(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) { this.preparar(type, color1, by, color2, message, color3, underline1, continuar, args, color4, underline2) }
}
