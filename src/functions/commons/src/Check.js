const { permissions } = require('./statics.json');

class Check {
  /** @param {Interaction, client} param @param {boolean} check */
  constructor(interaction, client) {
    /** @private */
    this.interaction = interaction;
    /** @private */
    this.client = client;
  }
  // Valida si el valor ingresado es undefined
  isEmplyInput(input) {
    if (!input) {
      const err = new Error(`Se esperaba una entrada de tipo string, se proporciono de tipo ${typeof input}`);
    }
  }
  /** obtiene los permisos indicados en el archivo statics.json
   * @param {string} permissionName * @returns {string[]} */
  getPermissions(permissionName) {
    let permissionList = [];
    permissions.map((permission) => {
      // Comprueba si en alias está el valor del permissionName y si es así, devuelve sus permisos
      const hasAlias = permission.alias.includes(permissionName.toLowerCase());
      if (hasAlias) permissionList.push(permission.permissions);
    })
    return permissionList;
  }

  /** valida que el usuario tenga los permisos del rango indicado
  @param {string[]} perms * @returns {boolean} */
  checkMemberPermissions(permissionName) {
    const completePermission = this.getPermissions(permissionName)
    if (!completePermission) return has
    // Si el usuario que ejecuto el comando no tiene los permisos, arrojara este error
    if(!this.interaction.member.permissions.has(completePermission)) {
      const err = new Error("Permisos insuficientes");
      err.code = 200;
      throw err;
    }
  }
}




module.exports = Check;