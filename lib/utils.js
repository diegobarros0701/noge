const pluralize = require('pluralize');

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

  /**
   * Sanitizes a name according to most common JS naming convention, depending of
   * the type
   * 
   * @param {String} name The value to be sanitized
   * @param {'class'|'var'} type The type of sanitize
   * 
   * @returns the sanitized value
   */
  static sanitizeName(name, type) {
    let sanitizedName = name.split('_')
      .map(nameChunk => {
        if (nameChunk == '')
          return '';

        return nameChunk[0].toUpperCase() + nameChunk.substring(1);
      })
      .join('');


    let sanitizedNameFirstLetter = type == 'class' ? sanitizedName[0].toUpperCase() : sanitizedName[0].toLowerCase();
    sanitizedName = sanitizedNameFirstLetter + sanitizedName.substring(1);

    return sanitizedName;
  }

  static plural(word) {
    return pluralize(word);
  }
}

module.exports = { Utils };