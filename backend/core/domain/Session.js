/**
 * Represents a Session.
 */
export class Session {
    /**
       * @param {string} sessionId - The unique identifier for the session.
       * @param {string} token - The token of the session.
       * @param {Date} createdAt - The date when the user was created.
       * @param {Date} expiredAt - The date when the user was expired.
       * @param {string} userId - The unique identifier for the session.
       */
    constructor(
      sessionId,
      token,
      createdAt,
      expiredAt,
      userId,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.sessionId = sessionId;
  
      /**
           * @type {string}
           */
      this.token = token;
  
      /**
           * @type {Date}
           */
      this.createdAt = createdAt;
  
      /**
           * @type {Date}
           */
      this.expiredAt = expiredAt;
  
      /**
           * @type {string}
           */
      this.userId = userId;
    }
  }
  