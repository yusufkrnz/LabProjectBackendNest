import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: {
        username: string;
        password: string;
        role?: string;
    }): Promise<import("src/schemas/user.schema").UserDocument>;
    findAll(): Promise<import("src/schemas/user.schema").UserDocument[]>;
    findOne(userId: string): Promise<import("src/schemas/user.schema").UserDocument>;
    findById(id: string): Promise<import("src/schemas/user.schema").UserDocument>;
    update(id: string, body: Partial<{
        username: string;
        password: string;
        role: string;
    }>): Promise<import("src/schemas/user.schema").UserDocument>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    resetUsers(): Promise<{
        success: boolean;
        count: number;
    }>;
}
