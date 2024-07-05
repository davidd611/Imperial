const { GuildMember } = require('discord.js')
const permissions = require('./permissions.json')
class Check {
  constructor(param) {
    this.param = param
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
  @param {string[]} args * @returns {void[]} */
  arguments(args) { 
    let argumentsList = [];
    args.map(argument => {
      const paramIndex = this.param.indexOf(argument)
      const param = this.param[args.indexOf(argument)+1];
      function add(value, message) {
        argumentsList.push({
          positionInFunction: args.indexOf(argument),
          positionOutOfFunction: paramIndex,
          argument: argument,
          message: message || "",
          has: value
        });
      }
      if (param === argument && paramIndex !== -1) add(true);
      else if (paramIndex === -1) {
        add(false, `Falta el argumento - **${argument}** N°${paramIndex} -`);
      }
      else {
        add(false, `Ocurrio un error inesperado N° de argumentos - ${args.length} - [ ${args} ]`);
      }
    });
    return argumentsList;
  }
  /**  Mapea un array de permisos y devuelve un array de booleanos
   * @example
   * const user = { member: { permissions: { has: ["Administrator", "SendMessages", "ViewChannel"] } } }
   * const permissionsCheck = new Check(user).permissions(['administrator', 'usuario'])
   * console.log(permissionsCheck) // [true, true]
  @param {string[]} perms * @returns {boolean[]} */
  permissions(perms) {
    let permissionList = [] 
    perms.map(perm => {
      function add(value, message) {
        permissionList.push({
            name: perm, 
            message: message || "", 
            has: value,
          })
      }
      const permission = this.completePermission(perm);
      if(this.param.member.permissions.has(permission[perms.indexOf(perm)])) add(true);
      else add(false, `No tienes permisos suficientes para realizar está acción.`);
    }) 
    return permissionList
  }
  /** @private */
  completePermission(perm) {
    let permissionList = [];
    const permissionsArray = perm.toLowerCase();
    permissionsArray.map(permissionObject => {
      permissionObject.alias.map(alias => {
        function add(value) { permissionList.push(value) }
        if (alias === permission) add(permissionObject);
      });
    });
    return permissionList;
  }
}
module.exports = Check;