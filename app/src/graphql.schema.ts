
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class RegisterInput {
    email: string;
    pw: string;
}

export class LoginInput {
    email: string;
    pw: string;
}

export class User {
    __typename?: 'User';
    createdAt: Timestamp;
    email: string;
    id: number;
    name?: string;
    pw: string;
    updatedAt: Timestamp;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract me(): User | Promise<User>;

    abstract user(id: number): User | Promise<User>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract register(data?: RegisterInput): User | Promise<User>;

    abstract login(data?: LoginInput): string | Promise<string>;
}

export type Timestamp = any;
