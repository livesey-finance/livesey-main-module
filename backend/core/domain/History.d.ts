export type AssetType = "Shares" | "Crypto";

export declare class History {
    readonly changeId: string;
    readonly assetType: AssetType;
    readonly assetId: string;
    readonly portfolioId: string;
    readonly amount: number;
    readonly priceAtTransaction: number;
    readonly currency: number;
    readonly transactionDate: Date;
    readonly ipAddress: string;

    constructor(
        changeId: string,
        assetType: AssetType,
        assetId: string,
        portfolioId: string,
        amount: number,
        priceAtTransaction: number,
        currency: number,
        transactionDate: Date,
        ipAddress: string
    );
}
