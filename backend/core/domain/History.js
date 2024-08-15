/**
 * Represents a History.
 */
/**
 * @typedef {"Shares" | "Crypto"} AssetType
 */
export class History {
    /**
         * @param {string} changeId - The unique identifier for the change or transaction.
         * @param {AssetType} assetType - The type of asset involved in the transaction (e.g., stock, cryptocurrency).
         * @param {string} assetId - The unique identifier for the specific asset.
         * @param {string} portfolioId - The unique identifier for the portfolio associated with the transaction.
         * @param {number} amount - The amount or quantity of the asset being transacted.
         * @param {number} priceAtTransaction - The price of the asset at the time of the transaction.
         * @param {number} currency - The currency code (e.g., USD, EUR) used for the transaction.
         * @param {Date} transactionDate - The date and time when the transaction occurred.
         * @param {string} ipAddress - The IP address from which the transaction was initiated.
         */

    constructor(
      changeId,
      assetType,
      assetId,
      portfolioId,
      amount,
      priceAtTransaction,
      currency,
      transactionDate,
      ipAdress,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.changeId = changeId;
  
      /**
           * @type {AssetType}
           */
      this.assetType = assetType;
  
      /**
           * @type {string}
           */
      this.assetId = assetId;
  
      /**
           * @type {string}
           */
      this.portfolioId = portfolioId;
  
      /**
           * @type {number}
           */
      this.amount = amount;
  
      /**
           * @type {number}
           */
      this.priceAtTransaction = priceAtTransaction;
  
      /**
           * @type {number}
           */
      this.currency = currency;
  
      /**
           * @type {Date}
           */
      this.transactionDate = transactionDate;
  
      /**
           * @type {string}
           */
      this.ipAdress = ipAdress;
    }
  }
  