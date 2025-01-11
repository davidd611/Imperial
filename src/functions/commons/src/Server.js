const minecraftServer = require("mcstatus-util");
const { statusJava, statusBedrock } = require("node-mcstatus")
const functions = require("./statics.json").functions;
const { setTimeout } = require("timers")
class Server {
  /**
   * @example new Server([client, message, discord])
   * @param {[client, interaction]} params 
   */
  constructor(param) {
    /** @private */
    this.client = param[0];
    /** @private */
    this.interaction = param[1];
    /** @private */
    this.response;
  }
  setRes(codigo, mensaje, contenido) // esto se supone que redefine la respuesta
  { this.response = { code: codigo, message: mensaje, content: contenido??null } }
  /** @returns { { code: number, message: string, content: { position, ip, name, modpack, version, status } } } */
  getall() {
    let res = { code: 0, message: "", content: null }
    const elementList = { position: [], ip: [], name: [], modpack: [], version: [], status: [] }
    // Ingresa a la base de datos con el identificador del servidor y devuelve elementos 
    // de mayor profundidad
    const elements = this.client.config.get(this.interaction.guild.id, "list.server")
    if (elements.length <= 0) { res.code = 404; res.message = "La lista está vacia"; }
    if (elements.length > 0) {
      elements.map((element) => {
        // agrega la posición del objeto dentro del array server a position
        elementList.position.push(elements.indexOf(element)??"")
        // mapea las propiedades de cada elementos del array
        for (const property in element) {
          elementList[property].push(element[property])
        }
      })
      res.code = 500; res.message = "Se ha obtenido toda la lista de elementos.";
    }
    res.content = elementList;
    return res;
  }
  add(args) {
    const template = { ip: "", name: "", modpack: "", version: "", status: "" }
    if (args.list === undefined) return this.setRes(100, "No se ha definido - list -");
    if (template[args.list] === undefined) return this.setRes(110, "La propiedad de elemento no es valida");
    if (template[args.list] !== undefined) {
      template[args.list] = args.content??"";
      // Agrega la plantilla template a el array server
      this.client.config.push(this.interaction.guild.id, template, "list.server");
      const newElements = this.getall().content;
      this.setRes(500, "Elemento añadido", newElements);
    }
    return this.response;
  }
  //-------------------------------------
  /** @private */
  clear() { // Limpia todas las listas
    // Modifica el array, cambiandolo a un array vacio
    this.client.config.set(this.interaction.guild.id, [], `list.server`);
    const all = this.getall();
    this.setRes(500, "Todos los elementos han sido eliminados.", all.content);
    return this.response;
  }
  /** @private */
   
  // y objeto-posición
  remove(args) { // elimina elemento en base a su posición, usa el valor de la propiedad para confirmar
    const template = { ip: "", name: "", modpack: "", version: "" }
    const list = this.client.config.get(this.interaction.guild.id, `list.server`);
    const position = args.position;
    // Verifica que la propiedad exista, la posicion no sea menor o mayor que el numero de elementos 
    // de la lista o que la lista este vacia
    if (!list.length) return this.setRes(404, "No hay elementos para eliminar.");
    if (position < 0) return this.setRes(120, "Posicion demasiado baja");
    if (position > list.length-1) return this.setRes(130, 'Posición demasiado alta');
    if (template[args.list] === undefined) return this.setRes(110, "La propiedad de elemento no es valida");
    if (args.content !== list[position][args.list]) return this.setRes(320, 'Ambos valores son diferentes');
    // se compara que la el argumento sea igual a la propiedad del elemento dentro del array
    if (args.content === list[position][args.list]) { 
      // elimina el elemento de el array
      this.client.config.remove(this.interaction.guild.id, list[position], 'list.server');
      const all = this.getall()
      this.setRes(500, `El elemento de la posición ${position} ha sido eliminado.`, all.content);
    }
    /*
    if (template[args.list] !== undefined) {
      if (list.length > 0) {
        if (position <= list.length-1) {
          if (args.content === list[position][args.list]) {
            this.client.config.remove(this.interaction.guild.id, list[position], 'list.server');
            const all = this.getall()
            this.setRes(500, `El elemento de la posición ${position} ha sido eliminado.`, all.content);
          } else this.setRes(320, 'Ambos valores son diferentes');
        } else if (position < 0) this.setRes(120, "Posicion demasiado baja");
        else if (position > list.length-1) this.setRes(130, 'Posición demasiado alta');
        else this.setRes(404, "Ha ocurrido un error inesperado.");
      } else { this.setRes(404, "No hay elementos para eliminar.") }
    } else this.setRes(110, "La propiedad de elemento no es valida");
    */
    return this.response;
  }
  /** @private */
  edit(args) { // edita la propiedad de un elemento en base a su posición en la lista
    const template = { ip: "", name: "", modpack: "", version: "" }
    const list = this.client.config.get(this.interaction.guild.id, `list.server`)
    const lists = this.getall();
    // Verifica que la propiedad ingresada sea valida, el codigo sea 500, no sea menor o mayor que 
    // el numero de objetos del array
    if (template[args.list] === undefined) return this.setRes(110, "La propiedad de elemento no es valida");
    if (lists.code !== 500) return this.setRes(404, lists.message);
    if (args.position <= 0) return this.setRes(120, "Posicion demasiado baja");
    if (args.position > list.length) return this.setRes(130, 'Posición demasiado alta');

    if (args.position < list.length) {
      // obtiene el valor del parametro dentro del objeto usando la posición del objeto
      const elementParam = list[args.position][args.list];
      // Modifica temporalmente el parametro del objeto
      list[args.position][args.list] = args.content;
      // obtiene el array de objetos
      const config = this.client.config.get(this.interaction.guild.id);
      // actualiza el array de objetos dentro de la base de datos
      this.client.config.update(this.interaction.guild.id, config);
      const all = this.getall();
      this.setRes(500, `El valor de parametro -${elementParam}- se ha cambiado a -${args.content}-.`, all.content);
    }
    return this.response;
  }
  chooseFunc(args) {
    let itHave = false;
    const clase = this;
    // Verifica que los permisos del usuario sean "Administrator" y devuelve un booleano
    const memberPermissions = this.interaction.member.permissions.has("Administrator");
    functions.map((element) => {
      const alias = element.alias.includes(args.option);
      console.log("[Server.ChooseFunc]", args.option, alias)
      if (alias) {
        itHave = true; 
        // Comprueba si la función no require permisos
        if (!element.permissions) return this.response = this[element.function](args);
        // comprueba que los permisos del usuario sean true y lláma a la función indicada
        if (memberPermissions) this.response = this[element.function](args);
        // Caso contrario, devuelve los permisos insuficientes
        else this.setRes(200, 'permisos insuficientes para realizar esta acción');
        console.log("[Server.chooseFunc] Función llamada con exito... o error");
      } 
    })
    if (!itHave) this.setRes(110, `No se reconoce la opción ${args.option}`);
    return this.response;
  }

  /** 
   * @description 
   * Takes an Array of strings, and depending of the content return a new value without modifiy the orginal Array
   * i! list ip edit nuevaIp 0
   * i! list ip add nuevaIp
   * i! list ip remove nuevaIp 0
   * i! list ip clear
   * i! list ip list
   * @example
   * const values = [
   *   {
   *     option: string, // options: list, clear, add, remove, edit
   *     list: string // ip, name, modpack, version
   *     content: string, // "sdasdsf"
   *     position: number // 0, 1, 2, 3, 4, 5, 6, 7
   *   },
   *   ...
   * ]
   * const list = new Server(client, interaction).list(values)
   
   * @param {string[]} values 
   * 
   * codes = {
   *  100: valor no definido
   *  110: valor invalido
   *  120: Posición demasiado baja
   *  130: Posición demasiado alta
   *  150: Error inesperado
   *  200: Permisos insuficientes
   *  320: Ambos valores diferentes
   *  404: Elemento no existente
   *  500: Exito
   * }
   */
  //             //         0    1  2       3
  list(values) { // i! list edit ip nuevaIp 0(posición)
    let res = { code: 0, message: "", content: null }
    const choiceRes = this.chooseFunc(values)
    // Obtiene el codigo de respuesta independientemente del resultado
    res.code = choiceRes.code;
    // Obtiene el mensaje si lo tiene, contrario, se mantendrá un string vacio
    res.message = choiceRes.message;
    if (choiceRes.code === 500) res.content = choiceRes.content;
    //console.log('F: list -', values);
    return res;
  }
  /** @param {string[]} ipList @returns*/
  javaStatusList() {
    const elements = this.client.config.get(this.interaction.guild.id, "list.server");
    if (elements.length <= 0) return
    elements.map((element) => {
      if (element["ip"] === "") element["status"] = "offline"
      else {
        try {
          // Comprueba el estado del servidor
          statusJava(element["ip"])
          // espera a que se resuelva la promesa de statusJava y verifica si devuelve online o offline
          .then((javaServer) => { element["status"] = javaServer.online?"online":"offline" });
        } catch(e) {console.log(e)}
      }
    });
  }
}
module.exports = Server