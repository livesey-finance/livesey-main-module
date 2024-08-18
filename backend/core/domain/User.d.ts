export declare class User {
    readonly userId: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly roleId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(
        userId: string,
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        roleId: string,
        createdAt: Date,
        updatedAt: Date
    );
}
