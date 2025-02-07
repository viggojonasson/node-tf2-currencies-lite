'use strict';

const toScrap = require('./toScrap');
const toRefined = require('./toRefined');
const truncate = require('./truncate');

/**
 * Creates a new Currencies instance
 * @class
 * @param {object} currencies The currencies object
 * @throws Will throw an error if missing currencies object, or if it is not valid
 */
function Currencies (currencies) {
    if (!currencies) {
        throw new Error('Missing currencies object');
    }

    this.keys = parseFloat(currencies.keys || 0);
    this.metal = parseFloat(currencies.metal || 0);

    if (isNaN(this.keys) || isNaN(this.metal)) {
        throw new Error('Not a valid currencies object');
    }

    this.metal = toRefined(toScrap(this.metal));
}

/**
 * Get the value of the currencies in scrap
 * @since 1.0.0
 * @param {number} conversion The refined value of keys
 * @return {number} The value of the this currencies instance
 * @throws Will throw an error if missing key conversion rate and there are keys
 */
Currencies.prototype.toValue = function (conversion) {
    if (conversion === undefined && this.keys != 0) {
        // The conversion rate is needed because there are keys
        throw new Error('Missing conversion rate for keys in refined');
    }

    let value = toScrap(this.metal);
    if (this.keys != 0) {
        value += this.keys * toScrap(conversion);
    }
    return value;
};

/**
 * Creates a string that represents this currencies object
 * @since 1.0.0
 * @return {string} Example: 1 key, 20.11 ref
 */
Currencies.prototype.toString = function () {
    const metal = this.metal + ' ref';
    // You are ugly.
    return this.keys === 0 ? metal : (this.keys === 1 ? `${this.keys + ( this.metal !== 0 ? ' key, ' + metal : ' key')}` : `${this.keys + ( this.metal !== 0 ? ' keys, ' + metal : ' keys')}` )
};

/**
 * Creates an object that represents this currencies object
 * @since 1.1.0
 * @return {object} Currencies object
 */
Currencies.prototype.toJSON = function () {
    const json = {
        keys: this.keys,
        metal: this.metal
    };

    return json;
};

module.exports = Currencies;
