const permissions = require('./permissions.json');

class Check {
  /** @param {[Interaction, args]} param @param {boolean} check */
  constructor(param, check) {
    /** @private */
    this.param = param
    if (check) {
      let argumentos = param[1];
      console.table(argumentos)
    }
  }
  /** Mapea un array de argumentos y devuelve un array de objetos
   * @example
   * const message = 'i!list set ip play.server.ip serverName';
   * const args = message.slice('i!'.length).trim().split(/ +/g);
   * const category = args[1];
   * const option = args[2];
   * const content = args[3];
   * const contentName = args[4]
   * let argumentsCheck = new Check(args).arguments([option, category, content, _name])
   * console.log(argumentsCheck)
   * 
   * // [
   * //   {
   * //     positionInFunction: number,
   * //     positionOutOfFunction: number,
   * //     message: string,
   * //     argument: string,
   * //     has: boolean
   * //   }
   * //   ...
   * // ]
  @param {string[]} args * @returns {{ positionInFunction: number, positionOutOfFunction: number, argument: string, message: string, has: boolean }[]} */
  arguments(args) { 
    let argumentsList = [];
    args.map(argument => {
      const paramIndex = this.param[1].indexOf(argument)
      const param = this.param[1][args.indexOf(argument)+1] ?? "";
      console.log(`┌───────────┬────────┬──────────┐\n│ ARGUMENTO │ TAMAÑO │ POSICION │\n├───────────┼────────┼──────────┤\n│     ${param}     │   0${param.length}   │    0${paramIndex}    │\n└───────────┴────────┴──────────┘`)
      if (param === "") add(false, `Falta el argumento - **${argument}** N°${paramIndex} -`);
      else if (param.length !== 0 && paramIndex !== -1) add(true);
      else add(false, `Ocurrio un error inesperado N°${args.indexOf(argument)} de argumentos - ${args.length} - [ ${args} ]`);
      function add(value, message) {
        argumentsList.push({
          positionInFunction: args.indexOf(argument),
          positionOutOfFunction: paramIndex,
          argument: argument,
          message: message || "",
          has: value
        });
      }
    });
    return argumentsList;
  }
  /**  Mapea un array de permisos y devuelve un array de booleanos
   * @example
   * const user = { member: { permissions: { has: ["Administrator", "SendMessages", "ViewChannel"] } } }
   * const permissionsCheck = new Check(user).permissions(['administrator', 'usuario'])
   * console.log(permissionsCheck)
   * // [
   * //   {
   * //     name: string,
   * //     message: string,
   * //     has: boolean
   * //   },
   * //   {
   * //     ...
   * //   },
   * //   ...
   * // ]
  @param {string[]} perms * @returns {{ name: string, message: string, has: boolean }[]
  } */
  permissions(perms) {
    let permissionList = [];
    perms.map(perm => {
      function add(value, message) {
        permissionList.push({
            name: perm, 
            message: message || "", 
            has: value,
          })
      }
      const permission = this.completePermission([perm]);
      if(this.param[0].member.permissions.has(permission)) add(true);
      else add(false, `No tienes permisos suficientes para realizar está acción.`);
    }) 
    return permissionList
  }
  /** 
   * @param {[]} perm
   * @private 
   * @returns any[]*/
  completePermission(perm) {
    let permissionList = [];
    const permissionsArray = perm;
    function add(value) { permissionList.push(value) }
    permissionsArray.map(permissionObject => {
      permissions.map(permission => {
        permission.alias.map(alias => {
          if (alias === permissionObject.toLowerCase()) add(permission.permissions);
        })
      })
    });
    return permissionList;
  }

  // Minecraft Servers Check----------------------------------------------------------------------
  /**
   * @example
   * (async() => {
   *   const exit = await new Check().minecraftServer('mc.galaxyorigins.com')
   *   console.log(exit)
   * })()
   * // {
   * //   version: { name: string, protocol: number },
   * //   players: { online: number, max: number, sample: [] },
   * //   motd: { raw: string, clean: string, html: string },
   * //   favicon: string,
   * //   srvRecord: null
   * //   roundTripLatency: number
   * // }
   * @param {string} ip 
   * @returns 
   */
}




module.exports = Check;