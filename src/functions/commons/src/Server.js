const minecraftServer = require("mcstatus-util");
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
    this.discord = param[2]
  }
  /** @private */
  getAll() { // obtiene todos los elementos de el [Array] de list.- server -
    const list = this.client.config.get(this.interaction.guild.id, 'list.server');
    const serverList = { ip: [], name: [], download: [], version: [] }
    if (list.length !== 0) { // Si list.server no está vacio, que ejecute lo siguiente
      list.map((server) => { // Mapea el [Array] de list.- server -
        // mapea los elementos de el [Object] y los añade a su respectivo [Array] de - serverList - 
        for (const listas in server) { serverList[listas].push(server[listas]??null); } 
       }); 
    } // Retornar la constante - serverList -
    return serverList 
  }
  /** @private */
  getOne(arg) {
    const todoList = this.getAll();
    const res = todoList[arg.position-1][arg.dir]
    if (res !== undefined || res !== null) return res;
    else return { code: 404, message: "Este elemento no existe"};
  }
  clear() { this.client.config.set(interaction.guild.id, [], `list.server`) }
  /** @private */
  createTemplate() { 
    const template = { ip: "", name: "", download: "", version: "" }
    this.client.config.push(interaction.guild.id, template, `list.server`);
  }
  /** @private */
  add(obj) {
    this.createTemplate();
    const list = this.client.config.get(this.interaction.guild.id, 'list.server');
    obj.position = list.length-1;
    this.edit(obj);
    const all = this.getAll();
    return all[obj.dir][all.indexOf(obj.argument)].replace(obj.argument, `->${obj.argument}`);
  }
  /** @private */
  remove(obj) {
    if (arg.position === undefined || arg.position === null) return { code: 100, message: "La posición de el objeto no ha sido definida" }
    const list = this.client.config.get(this.interaction.guild.id, `list.server`);
    if (obj.position <= list.length) {
      if (obj.argument === list[obj.position]) {
        this.client.config.remove(this.interaction.guild.id, list[position], 'list.server');
        return this.getAll()[obj.dir]
      } else return { code: 320, message: 'Ambos valores son diferentes' };
    } else return { code: 120, message: 'Posición demasiado alta'};
  }
  /** @private */
  edit(obj) { 
    if (arg.position === undefined || arg.position === null) return { code: 100, message: "La posición de el objeto no ha sido definida" }
    const list = this.client.config.get(this.interaction.guild.id, `list.server`) 
    if (obj.position > list.length) {
      list[obj.position-1][obj.dir] = obj.argument;
      const all = this.getAll();
      return all[obj.dir][all.indexOf(obj.argument)].replace(obj.argument, `->${obj.argument}`);
    } else return { code: 190, message: 'Posición demasiado alta' }
  }
  checkPosition(arg) {
    if (arg.position === undefined || arg.position === null) return { code: 100, message: "La posición de el objeto no ha sido definida" }
  }
  /** 
   * @example
   * const values = [
   *   {
   *     choice: string // ip, name, modpack, version
   *     option: string, // options: list get, clear, add, remove, edit
   *     dir: string, // dir's ("ip", "name", "modpack", "version")
   *     arguments: string, // "sdasdsf"
   *     position: number // 0, 1, 2, 3, 4, 5, 6, 7
   *   },
   *   ...
   * ]
   * const list = new Server(client, interaction).list(values)
   * codes {
   *  100: Posición no definida
   *  120: Posición demasiado alta
   *  190: Posición demasiado alta
   *  200: Permisos insuficientes
   *  320: Ambos valores diferentes
   *  404: Elemento no existente
   *  500: Exito
   * }
   * @param {Array} values */
  list(values) { // !i list ip edit nuevaIp 7(posición en la cuerda)
    let res;
    const perms = this.interaction.member.permissions.has("Administrator");
    const optionChoose = this;
    const serverChoice = {
      ip(arg) { arg.dir = "ip"; return optionChoose[arg.option](arg); },
      name(arg) { arg.dir = "name"; return optionChoose[arg.option](arg); },
      modpack(arg) { arg.dir = "modpack"; return optionChoose[arg.option](arg); },
      version(arg) { arg.dir = "version"; return optionChoose[arg.option](arg); },
      all(arg) { return optionChoose[arg.option](arg); }
    }
    values.map((v) => {
      const vOptions = ['clear', 'add', 'remove', 'edit'];
      const option = v.option.toLowerCase();
      let allowed = true;
      if (option === 'list') v.option = 'getAll';
      if (option === 'get') v.option = 'getOne';
      // Se necesita crear una función que reasigne el metodo - option - a un metodo de función usado
      // localmente en esta clase
      vOptions.map((vOption) => {
        if (option === vOption) {
          if (!perms) allowed = false;
        }
      })
      if (allowed) { res = { code: 500, message: "Se logro completar la acción", content: serverChoice[v.choice.toLowerCase()](v) }}
      else { res = {code: 200, message: 'permisos insuficientes para realizar esta acción'} }
    });
    //console.log('F: list -', values);
    return res
  }
  async minecraft(ip) {
    const server = await minecraftServer.status(ip)
    .catch((error) => { return { code: 404, message: error} });
    const result = {
      server: {
        ip: ip,
        name: {
          raw: server.motd.raw,
          clean: server.motd.clean,
          html: server.motd.html
        }
      },
      version: server.version,
      players: { 
        online: server.players.online,
        limit: server.players.max,
        users: server.players.sample
      },
      icon: server.favicon,
      roundTripLatency: server.roundTripLatency,
      code: 500
    };
    return result;
  }
}
/*
(async() => {
  const exit = new Server()
  console.log(await exit.minecraft('mc.galaxyorigins.com').players);
})()
*/
module.exports = Server