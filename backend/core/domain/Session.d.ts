export declare class Session {
    readonly sessionId: string;
    readonly token: string;
    readonly createdAt: Date;
    readonly expiredAt: Date;
    readonly userId: string;

    constructor(
        sessionId: string,
        token: string,
        createdAt: Date,
        expiredAt: Date,
        userId: string,
    );
}