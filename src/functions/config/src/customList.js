/**
 * Requisitos de la lista personalizada
 * 
 * El objeto que instancia a lista debe estar dentro del la ruta de objetos list.custom
 * Lista dentro de un objeto
 * Nombre de lista debe ser definido por el usuario
 * Lista es un array
 * array en la posición 0 para los parametros
 * array dentro de la lista que contiene los parametros que utilizaran los elementos de la ella
 * Mapear empezando desde la posición 1 de la lista
*/

class CustomList {
  constructor(client, interaction) {
    this.client = client;
    this.interaction = interaction;
  }

  // --- CHECKERS --------------------------------------------------------------

  noExist(list) {
    if (list === undefined) {
      const noExistError = new Error(`The list - ${list} - doesn't exist yet`)
      noExistError.code = 404
      throw noExistError
    }
  }
  alreadyExist(list) {
    if (list !== undefined) {
      const existError = new Error(`List - ${list} - already exist`)
      existError.code = 200;
      throw existError;
    }
  }
  isUsingArguments(args) {
    args.map((arg) => {
      if (arg === undefined) {
        const unusedArgumentError = new Error(`The argument - ${arg} is unused - or is declarated as undefined`)
        unusedArgumentError.code = 203
        throw unusedArgumentError
      }
    })
  }
  isVoid(list) {
    if (list.length <= 1 ) {
      const voidListError = new Error("The list is void")
      voidListError.code = 203
      throw voidListError
    }
  }

  // ---------------------------------------------------------------------------
  // --- RESPONSE --------------------------------------------------------------

  returnRes(code, message, content) {
    const returnedResponse = { code: code, message: message, content: content }
    return returnedResponse
  }

  // ---------------------------------------------------------------------------
  // --- GETTERS ---------------------------------------------------------------

  /** @private */
  getRealListName(listName) {
    const listNames = this.getAllCustoms().content; // {retorna un objeto con todas las listas}
    for (const RealListName of listNames) {
      if (RealListName.toLowerCase() === listName.toLowerCase()) return RealListName
    }
  }
  getAllCustoms() {
    const allLists = this.client.config.get(this.interaction.guild.id, "list.custom")
    this.isVoid(allLists)
    return this.returnRes(200, "List checked", allLists)
  }
  getCustom(name) {
    const list = this.client.config.get(this.interaction.guild.id, `list.custom.${name}`);
    this.noExist(list)
    this.isVoid(list)
    return this.returnRes(200, "List found", list)
  }
  getCustomElement(name, element) {
    const customList = this.getCustom(name)
    customList.content.map((element) => {
      element.map((property) => {
        // aca van las propiedades de un elemento dentro de un array
      })
    })
  }
  // ---------------------------------------------------------------------------
  // --- ADD -------------------------------------------------------------------
  /** @param {string} params */
  createCustom(name, params) {
    // Comprueba si ya existe una lista con el mismo nombre
    this.alreadyExist(this.getAllCustoms().content[name])
    const template = [[]]
    //
    params.replace(/ +/g, "").split(",").map((param) => { template[0].push(param) })
    this.client.config.push(this.interaction.guild.id, template, `list.custom`)
  }
  createCustomElement(customName, args) {
    // obtiene el contenido de la lista solicitada
    // Dentro de la subLlamada, comprueba si la lista !== undefined y si tiene > 1 elemento
    const custom = this.getCustom(customName).content[0]; // Array de parametros a usar
    const template = {}
    custom.map((param) => {
      const argums = args.split(",") // Separa el mensaje en un array
      const argum = argums[custom.indexOf(param)] // Comprueba la posición en ambos arrays
      if (!argum) { // Si falta un argumento de la lista en el mensaje, lanzará un error
        const argumError = new Error(`parametros de lista incompletos (${argums.length}/${custom.length})`);
        argumError.code = 404;
        throw argumError
      }
      template[param] = argum; // Asigna un nuevo objeto a la plantilla con el valor de su 
      // posición en el array del mensaje y parametro
    })
    this.client.config.push(this.interaction.guild.id, template, `list.custom.${this.getRealListName(customName)}`)
  }
  // ---------------------------------------------------------------------------
  // --- REMOVE ----------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // --- CLEAR -----------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // --- EDIT ------------------------------------------------------------------
}