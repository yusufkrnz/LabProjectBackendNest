import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(username: string, password: string, role?: string): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findByUserId(userId: number): Promise<UserDocument>;
    findById(id: string): Promise<UserDocument>;
    updateUser(id: string, updateData: Partial<User>): Promise<UserDocument>;
    deleteUser(id: string): Promise<{
        success: boolean;
    }>;
    resetUsers(): Promise<{
        success: boolean;
        count: number;
    }>;
}
