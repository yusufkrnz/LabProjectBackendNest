import { Document } from 'mongoose';
import { Gender } from './gender-enum';
export type UserDocument = User & Document;
export declare class User extends Document {
    userId?: number;
    eMail: string;
    username: string;
    surname: string;
    passwordHash: string;
    isActive: boolean;
    gender: Gender;
    role: string;
    refreshTokenHash?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
