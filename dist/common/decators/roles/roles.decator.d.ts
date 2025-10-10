import { RolesEnum } from './roles.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RolesEnum[]) => import("@nestjs/common").CustomDecorator<string>;
