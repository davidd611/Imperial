class Guild {
  /**
   * @example new Guild([message, client])
   * @param {[message, client]} param
   * @returns {[object, void]}
  */
  constructor(param) {
    /** @private */
    this.param = param
  }
  prefix() { return this.param[1].config.get(this.param[0].guild.id, 'prefix') }
}
module.exports = Guild;