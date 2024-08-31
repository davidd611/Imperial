
let date = new Date();
module.exports = class DateText {
  getDate() {   
  return '[AA_MM_DD][HH-MM-SS]'
  .replace('AA_MM_DD', `${date.getUTCDay()}_${date.getUTCMonth()+1}_${date.getUTCFullYear()}`)
  .replace('HH-MM-SS', `${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}`)
}
  estructurar() {
  return `${this.getDate().replace(/_/g, '/').replace(/-/g, ':')} [type][by] [message] args`.toUpperCase();
}

  mensaje(type, by, message, continuar, args) {
  let res = this.estructurar()
  .replace('type'.toUpperCase(), type.toUpperCase())
  .replace('by'.toUpperCase(), by.toUpperCase())
  .replace('message'.toUpperCase(), message)
  if (continuar === true) {
    res = res.replace('args'.toUpperCase(), args)
  } else { res = res.replace('args'.toUpperCase(), '') }
  return res;
}
}
