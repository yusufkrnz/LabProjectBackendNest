import { PreloginService } from "./prelogin.service";
import { User } from "src/schemas/user.schema";
export declare class PreloginController {
    private readonly preloginService;
    constructor(preloginService: PreloginService);
    getAllUsers(): Promise<User[]>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
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
