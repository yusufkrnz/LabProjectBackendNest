import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class PreloginService {
    private userModel;
    private readonly jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    findAllUsers(): Promise<User[]>;
    findUserById(id: string): Promise<User>;
    createUser(body: Partial<User>): Promise<User>;
    updateUser(id: string, body: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<boolean>;
    login(username: string, password: string): Promise<{
        success: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
            id: unknown;
            userId: number | undefined;
            username: string;
            role: string;
            eMail: string;
        };
    }>;
}
