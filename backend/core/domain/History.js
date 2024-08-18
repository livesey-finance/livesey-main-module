export class History {
     constructor(
         changeId,
         assetType,
         assetId,
         portfolioId,
         amount,
         priceAtTransaction,
         currency,
         transactionDate,
         ipAddress
     ) {
         this.changeId = changeId;
         this.assetType = assetType;
         this.assetId = assetId;
         this.portfolioId = portfolioId;
         this.amount = amount;
         this.priceAtTransaction = priceAtTransaction;
         this.currency = currency;
         this.transactionDate = transactionDate;
         this.ipAddress = ipAddress;
     }
}
 