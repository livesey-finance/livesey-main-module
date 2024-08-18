export class Currency {
     constructor(
         currencyId,
         lastUpdated,
         currencyCode,
         exchangeRate
     ) {
         this.currencyId = currencyId;
         this.lastUpdated = lastUpdated;
         this.currencyCode = currencyCode;
         this.exchangeRate = exchangeRate;
     }
}
 