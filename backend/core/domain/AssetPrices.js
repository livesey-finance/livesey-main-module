export class AssetPrices {
  constructor(
    assetPriceId,
    assetType,
    assetId,
    purchasePrice,
    currentPrice,
    priceDate
  ) {
    this.assetPriceId = assetPriceId;
    this.assetType = assetType;
    this.assetId = assetId;
    this.purchasePrice = purchasePrice;
    this.currentPrice = currentPrice;
    this.priceDate = priceDate;
  }
}
