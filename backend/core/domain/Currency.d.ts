export declare class Currency {
    readonly currencyId: string;
    readonly lastUpdated: Date;
    readonly currencyCode: string;
    readonly exchangeRate: number;

    constructor(
        currencyId: string,
        lastUpdated: Date,
        currencyCode: string,
        exchangeRate: number
    );
}
