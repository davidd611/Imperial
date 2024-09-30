const minecraftServer = require("mcstatus-util");
const functions = require("./statics.json").functions;
class Server {
  /**
   * @example new Server([client, message, discord])
   * @param {[client, interaction, discord]} params 
   */
  constructor(param) {
    /** @private */
    this.param = param; 
    /** @private */
    this.client = param[0];
    /** @private */
    this.interaction = param[1];
    /** @private */
    this.response;
  }
  setRes(codigo, mensaje, contenido) // esto se supone que redefine la respuesta
  { this.response = { code: codigo, message: mensaje, content: contenido??null } }
  /** @returns { { code: number, message: string, content: { position, ip, name, modpack, version } } } */
  getall() {
    let res = { code: 0, message: "", content: null }
    const elementList = { position: [], ip: [], name: [], modpack: [], version: [] }
    const elements = this.client.config.get(this.interaction.guild.id, "list.server")
    if (elements.length > 0) {
      elements.map((element) => {
        elementList.position.push(elements.indexOf(element)??"")
        for (const property in element) {
          elementList[property].push(element[property])
        }
      })
      res.code = 500; res.message = "Se ha obtenido toda la lista de elementos.";
    } else { res.code = 404; res.message = "La lista está vacia"; }
    res.content = elementList;
    return res;
  }
  add(args) {
    
    const elements = this.client.config.get(this.interaction.guild.id, "list.server");
    const template = { ip: "", name: "", modpack: "", version: "" }
    if (args.list !== undefined) {
      if (template[args.list] !== undefined) {
        template[args.list] = args.content??null;
        this.client.config.push(this.interaction.guild.id, template, "list.server");
        const newElements = this.getall().content;
        this.setRes(500, "Elemento añadido", newElements);
      } else this.setRes(110, "La propiedad de elemento no es valida");
    } else this.setRes(100, "No se ha definido - property -");
    return this.response;
  }
  //-------------------------------------
  /** @private */
  clear() { // Limpia todas las listas
    
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
    return this.response;
  }
  /** @private */
  edit(args) { // edita la propiedad de un elemento en base a su posición en la lista
    const template = { ip: "", name: "", modpack: "", version: "" }
    const list = this.client.config.get(this.interaction.guild.id, `list.server`)
    const lists = this.getall();
    if (template !== undefined) {
      if (lists.code === 500) {
        if (args.position < list.length) {
          const elementParam = list[args.position][args.list];
          list[args.position][args.list] = args.content;
          const config = this.client.config.get(this.interaction.guild.id);
          this.client.config.update(this.interaction.guild.id, config);
          const all = this.getall();
          this.setRes(500, `El valor de parametro -${elementParam}- se ha cambiado a -${args.content}-.`, all.content);
        } else if (args.position > list.length) this.setRes(130, 'Posición demasiado alta');
        else this.setRes(120, "Posicion demasiado baja");
      } else this.setRes(404, lists.message)
    } else this.setRes(110, "La propiedad de elemento no es valida");
    return this.response;
  }
  chooseFunc(args) {
    
    const esto = this;
    const memberPermssions = this.interaction.member.permissions.has("Administrator");
    functions.map((element) => {
      element.alias.map((alias) => {
        if (args.option === alias) {
          if (element.permissions) {
            if (memberPermssions) this.response = esto[element.function](args);
            else esto.this.setRes(200,  'permisos insuficientes para realizar esta acción');
          } else this.response = esto[element.function](args);
          console.log(`F.R: ${element.function} -`, this.response);
        }
        //console.log("F: chooseFunc{element()} -", element)
      })
    })
    return this.response;
  }

  /** 
   * i! list ip edit nuevaIp 0
   * i! list ip add nuevaIp
   * i! list ip remove nuevaIp 0
   * i! list ip clear
   * i! list ip get 0
   * i! list ip list
   * @example
   * const values = [
   *   {
   *     option: string, // options: list get, clear, add, remove, edit
   *     choice: string // ip, name, modpack, version
   *     content: string, // "sdasdsf"
   *     position: number // 0, 1, 2, 3, 4, 5, 6, 7
   *   },
   *   ...
   * ]
   * const list = new Server(client, interaction).list(values)
   
   * @param {Array} values 
   * codes = {
   *  100: valor no definido
   *  110: valor invalido
   *  120: Posición demasiado baja
   *  130: Posición demasiado alta
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
    res.code = choiceRes.code;
    res.message = choiceRes.message;
    if (choiceRes.code === 500) res.content = choiceRes.content;
    //console.log('F: list -', values);
    return res;
  }
  /** 
  @param {string} ip 
  @returns {
    { 
      server: {
        ip: string,
        name: { raw: string, clean: string, html: string }
      },
      version: string,
      players: {  online: number, limit: number, users: object },
      icon: string,
      roundTripLatency: number,
      code: number
    }
  } 
  */
  async minecraft(ip) {
    let result; // resultado a retornar
    await minecraftServer.status(ip) // petición a la ip solicitada
    .then((res) => { // si esta en linea, establecera el valor de - result - a este objeto:
      result = { 
        server: {
          ip: ip,
          name: { raw: res.motd.raw, clean: res.motd.clean, html: res.motd.html },
          version: res.version,
          players: { online: res.players.online, limit: res.players.max, users: res.players.sample },
          icon: res.favicon,
          roundTripLatency: res.roundTripLatency,
        },
        code: 500
      };
    }) 
    // si falla, devuelve codigo de error y mensaje en un objeto
    .catch((error) => { result = { code: 404, message: error } });
    return result; // retorno resultado
  }
}
/*
(async() => {
  const exit = new Server()
  console.log(await exit.minecraft('mc.galaxyorigins.com').players);
})()
*/
module.exports = Server