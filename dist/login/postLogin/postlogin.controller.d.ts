import { PostloginService } from './postlogin.service';
export declare class PostloginController {
    private readonly postloginService;
    constructor(postloginService: PostloginService);
    refreshToken(body: {
        refreshToken: string;
    }): Promise<{
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
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(req: any, body: {
        oldPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
