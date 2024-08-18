export type AssetType = "Shares" | "Crypto";

export declare class AssetPrices {
    readonly assetPriceId: string;
    readonly assetType: AssetType;
    readonly assetId: string;
    readonly purchasePrice: number;
    readonly currentPrice: number;
    readonly priceDate: Date;

    constructor(
        assetPriceId: string,
        assetType: AssetType,
        assetId: string,
        purchasePrice: number,
        currentPrice: number,
        priceDate: Date
    );
}
