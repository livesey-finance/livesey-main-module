/**
 * Represents a Currency.
 */
export class Currency {
    /**
     * Creates a new Currency instance.
     * 
     * @param {string} currencyId - A unique ID for the currency.
     * @param {Date} lastUpdated - The date when the exchange rate was last updated.
     * @param {string} currencyCode - The official currency code (e.g., "USD" for US Dollar).
     * @param {number} exchangeRate - The exchange rate compared to the base currency.
     */
    constructor(
        currencyId,
        lastUpdated,
        currencyCode,
        exchangeRate,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.currencyId = currencyId;
  
      /**
           * @type {Date}
           */
      this.lastUpdated = lastUpdated;
  
      /**
           * @type {string}
           */
      this.currencyCode = currencyCode;
  
      /**
           * @type {number}
           */
      this.exchangeRate = exchangeRate;
    }
  }
  