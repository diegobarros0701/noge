class Utils {

  /**
   * Convert an array to an object with true values for each array value
   * 
   * @param {Array} values Array to be converted
   */
  static arrayToObject(values) {
    if (values.length == 0)
      return {};

    return values.reduce((obj, item) => ({ ...obj, [item]: true }), {});
  }
}

module.exports = { Utils };