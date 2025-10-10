import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    createUser(username: string, password: string, role?: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findByUsername(username: string): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    findById(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    setRefreshTokenHash(userId: string, hash: string): Promise<void>;
    clearRefreshTokenHash(userId: string): Promise<void>;
}
