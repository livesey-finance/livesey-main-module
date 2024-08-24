export class Session {
  constructor(
    sessionId,
    token,
    createdAt,
    expiredAt,
    userId,
  ) {
    this.sessionId = sessionId;
    this.token = token;
    this.createdAt = createdAt;
    this.expiredAt = expiredAt;
    this.userId = userId;
  }
}
