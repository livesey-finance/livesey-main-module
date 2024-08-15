/**
 * Represents a MFA.
 */
/**
 * @typedef {"SMS" | "EMAIL"} Method
 */
export class Mfa {
    /**
      * @param {string} mfaId - The unique identifier for the MFA (Multi-Factor Authentication).
      * @param {Method} method - The method used for MFA, which could be an enum or specific type (e.g., SMS, Email, Authenticator App).
      * @param {boolean} isEnabled - Indicates whether MFA is enabled for the user.
      * @param {string} secretKey - The secret key used for generating or verifying MFA codes.
      * @param {string} userId - The unique identifier for the user associated with this MFA setup.
      */
    constructor(
      mfaId,
      method,
      isEnabled,
      secretKey,
      userId,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.mfaId = mfaId;
  
      /**
           * @type {Method}
           */
      this.method = method;
  
      /**
           * @type {boolean}
           */
      this.isEnabled = isEnabled;
  
      /**
           * @type {string}
           */
      this.secretKey = secretKey;
  
      /**
           * @type {string}
           */
      this.userId = userId;
    }
  }
  