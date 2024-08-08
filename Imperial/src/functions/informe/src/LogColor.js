require('colors');

module.exports = class LogColor {
  colorear(value, color, underline) { 
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
  simplificar(value, removeC, removeU) {
    let colores = [ ' '.black, ' '.blue, ' '.cyan, ' '.gray, ' '.green, ' '.grey, ' '.magenta, ' '.red, ' '.white, ' '.yellow ]
    let res = value
    if (removeC === true) {
      colores.map(c => { 
        let cols = c.split(' ');
        cols.map(i => {
          let tiene = true;
          while (tiene === true) {
            let find = res.includes(i); if (find === false) tiene = false;
            if (tiene !== false) res = res.replace(i, ''); 
          }
        });
      });
    }
    if (removeU === true) {
      ' '.underline.split(' ').map(i => {
        let tiene = true;
        while (tiene === true) {
          let find = res.includes(i); if (find === false) tiene = false;
          if (tiene !== false) res = res.replace(i, ''); 
        }
      });
    }
    return res
  }
}
