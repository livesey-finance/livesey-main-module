export type Method = "SMS" | "EMAIL";

export declare class Mfa {
    readonly mfaId: string;
    readonly method: Method;
    readonly isEnabled: boolean;
    readonly secretKey: string;
    readonly userId: string;

    constructor(
        mfaId: string,
        method: Method,
        isEnabled: boolean,
        secretKey: string,
        userId: string
    );
}
