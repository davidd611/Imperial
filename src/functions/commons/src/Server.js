// Deprecated -- const minecraftServer = require("mcstatus-util");
const { statusJava, statusBedrock } = require("node-mcstatus")
const { functions } = require("./statics.json");
const { setTimeout } = require("timers")
class Server {
  /**
   * @example new Server([client, message, discord])
   * @param {discord.Client} client
   * @param {discord.Interaction | discord.Message} interaction
   */
  constructor(client, interaction) {
    /** @private */
    this.client = client;
    /** @private */
    this.interaction = interaction;
    /** @private */
    this.response;
    /** @private */
    this.reference = ["ip", "name", "modpack", "version"];
  }
  // ------------------------------------- Métodos de modificación interna, validación y obtención
  setRes(codigo, mensaje, contenido) { // esto se supone que redefine la respuesta
    this.response = { code: codigo??150, message: mensaje??"", content: contenido??null }
    return this.response;
  }
  checkClearList(list) {
    if (!list.length) {
      const err = new Error("La lista se encuentra vacia");
      err.code = 404;
      throw err;
    }
  }
  checkProperty(property) {
    if (!this.reference.includes(property)) {
      const err = new Error("La propiedad de elemento no es valida");
      err.code = 110;
      throw err;
    }
  }
  validatePosition(position, min, max) {
    // valida si position es menor que min o mayor que max, sino, no hace nada
    // validate if position is minor than min or upper than max, else, doesn't anything
    if (position < min) {
      const err = new Error("La posición es demasiado baja");
      err.code = 120;
      throw err;
    }
    if (position > max) {
      const err = new Error("la posición es demasiado alta");
      err.code = 130;
      throw err;
    }
  }
  /** @returns { { code: number, message: string, content: { position, ip, name, modpack, version, status } } } */
  getall() {
    let res = { code: 0, message: "", content: null }
    const elementList = { position: [], ip: [], name: [], modpack: [], version: [], status: [] }
    try {
      // Obtiene elementos con profundidad mayor a la indicada en el segundo argumento
      const list = this.client.config.get(this.interaction.guild.id, "list.server")
      // Valida si la lista esta limpia
      this.checkClearList(list);
      // mapea el array list
      list.map((element) => {
        // agrega la posición del objeto dentro del array server a position
        elementList.position.push(list.indexOf(element)??"")
        // mapea las propiedades de cada elementos del array
        for (const property in element) {
          elementList[property].push(element[property])
        }
      })
      res.code = 500; 
      res.message = "Se ha obtenido toda la lista de elementos.";
      res.content = elementList;
    } catch(e) {
      res.code = e.code; 
      res.message = e.message; 
      res.content = elementList;
    }
    return res;
  }
  // ------------------------------------- Métodos que requieren permisos
  /** @private */
  add(args) {
    try {
      const template = { ip: "", name: "", modpack: "", version: "", status: "" }
      this.checkProperty(args.list)
      if (template[args.list] !== undefined) {
        template[args.list] = args.content??"";
        // Agrega la plantilla template a el array server
        this.client.config.push(this.interaction.guild.id, template, "list.server");
        const newElements = this.getall().content;
        this.setRes(500, "Elemento añadido", newElements);
      }
      return this.response;
    } catch (e) {
      return this.setRes(e.code. e.message);
    }
  }
  /** @private */
  clear() { // Limpia todas las listas
    // Modifica el array, estableciendolo en un array vacio.
    this.client.config.set(this.interaction.guild.id, [], `list.server`);
    const all = this.getall();
    this.setRes(500, "Todos los elementos han sido eliminados.", all.content);
    return this.response;
  }
  /** @private */
  remove(args) { // elimina elemento en base a su posición, usa el valor de la propiedad para confirmar
    try {
      const list = this.client.config.get(this.interaction.guild.id, `list.server`);
      const position = args.position;
      // Valida que array no este vacio, posición no sea mayor o menor que el array o objeto diferente
      this.checkClearList(list)
      this.validatePosition(position, 0, list.length-1);
      this.checkProperty(args.list);
      if (args.content !== list[position][args.list]) return this.setRes(320, 'Ambos valores son diferentes');
      // elimina el elemento de el array
      this.client.config.remove(this.interaction.guild.id, list[position], 'list.server');
      const all = this.getall()
      this.setRes(500, `El elemento de la posición ${position} ha sido eliminado.`, all.content);
    } catch (e) {
      //this.client.informe.error("Server.remove", e.message)
      this.setRes(e.code, e.message)
    }
    return this.response
  }
  /** @private */
  edit(args) { // edita la propiedad de un elemento en base a su posición en la lista
    try {
      const template = { ip: "", name: "", modpack: "", version: "" }
      const list = this.client.config.get(this.interaction.guild.id, `list.server`)
      const lists = this.getall();
      // Valida las propiedades, si el array esta vacio y que posición no se mayor o menor que el tamaño maximo del array
      this.checkProperty(args.list);
      this.checkClearList(list)
      this.validatePosition(args.position, 0, list.length-1)
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
    } catch (e) {
      this.setRes(e.code, e.message)
    }
    return this.response;
  }
  // ------------------------------------- Métodos de entrada y selección
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
        // Comprueba si la función no require permisos y si el usuario tiene los permisos necesarios
        if (!element.permissions) return this.response = this[element.function](args);
        if (!memberPermissions) return this.setRes(200, 'permisos insuficientes para realizar esta acción');
        // comprueba que los permisos del usuario sean true y lláma a la función indicada
        if (memberPermissions) this.response = this[element.function](args);
        // Caso contrario, devuelve los permisos insuficientes
        console.log("[Server.chooseFunc] Función llamada con exito... o error");
      } 
    })
    if (!itHave) return this.setRes(110, `No se reconoce la opción ${args.option}`);
    return this.response;
  }

  /** 
   * Use an object who is defined with: option, list, content and position respectibly.
   * 
   * @example
   * const values = [
   *   {
   *     option: string, // list, clear, add, remove, edit
   *     list: string // ip, name, modpack, version
   *     content: string, // "an argument of any type that you want to input here"
   *     position: number // too long how is the list of the guild
   *   },
   *   ...
   * ]
   * const list = new Server(client, interaction).list(values)
   * @param {string[]} values 
   */
  //             //         0    1  2       3
  list(values) { // i! list edit ip nuevaIp 0(posición)
    let res = { code: 0, message: "", content: null }
    // llama chooseFunc para que seleccione la función
    const choiceRes = this.chooseFunc(values)
    // Obtiene el codigo de respuesta independientemente del resultado
    res.code = choiceRes.code;
    // Obtiene el mensaje si lo tiene, contrario, se mantendrá un string vacio
    res.message = choiceRes.message;
    if (choiceRes.code === 500) res.content = choiceRes.content;
    //console.log('F: list -', values);
    return res;
  }
  // ------------------------------------- Funciones de verificaciones externas
  /**
   * Change status property of all objects in the server list who it's an array of objects
   * @returns 
   */
  javaStatusList() {
    const elements = this.client.config.get(this.interaction.guild.id, "list.server");
    if (elements.length <= 0) return
    elements.map((element) => {
      if (element["ip"] === "") element["status"] = "offline"
      else {
        try {
          // Comprueba el estado del servidor
          statusJava(element["ip"])
          // Cuando se resuelva la promesa statusJava cambia status a online o offline
          .then((javaServer) => { element["status"] = javaServer.online?"online":"offline" });
        } catch(e) {console.log(e)}
      }
    });
  }
}
module.exports = Server