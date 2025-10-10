import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
export declare class PostloginService {
    private userModel;
    private readonly jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    refreshToken(refreshToken: string): Promise<{
        success: boolean;
        accessToken: string;
        user: {
            id: unknown;
            userId: number | undefined;
            username: string;
            role: string;
            eMail: string;
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
