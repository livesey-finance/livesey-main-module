/**
 * Represents an AssetPrices.
 */
/**
 * @typedef {"Shares" | "Crypto"} AssetType
 */
export class AssetPrices {
    /**
     * Creates a new instance of AssetPrices.
     * 
     * @param {string} assetPriceId - A unique ID for the asset price record.
     * @param {AssetType} assetType - The type of asset (e.g., "Shares" for stocks, "Crypto" for cryptocurrency).
     * @param {string} assetId - A unique ID for the asset.
     * @param {number} purchasePrice - The price at which the asset was originally purchased.
     * @param {number} currentPrice - The current market price of the asset.
     * @param {Date} priceDate - The date when the price was recorded.
     */
    constructor(
     assetPriceId,
     assetType,
     assetId,
     purchasePrice,
     currentPrice,
     priceDate,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.assetPriceId = assetPriceId;
  
      /**
           * @type {AssetType}
           */
      this.assetType = assetType;
  
      /**
           * @type {string}
           */
      this.assetId = assetId;
  
      /**
           * @type {number}
           */
      this.purchasePrice = purchasePrice;
  
      /**
           * @type {number}
           */
      this.currentPrice = currentPrice;
  
      /**
           * @type {Date}
           */
      this.priceDate = priceDate;
    }
  }
  