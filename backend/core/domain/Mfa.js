export class Mfa {
     constructor(
         mfaId,
         method,
         isEnabled,
         secretKey,
         userId
     ) {
         this.mfaId = mfaId;
         this.method = method;
         this.isEnabled = isEnabled;
         this.secretKey = secretKey;
         this.userId = userId;
     }
}
 