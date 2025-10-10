import{RolesEnum}from'./roles.enum'

export const DEFAULT_ROLE=RolesEnum.USER;

export const ROLE_HIERARCHY:Record<RolesEnum,number>={
    [RolesEnum.ADMIN]:2,
    [RolesEnum.USER]:1,
};

export const ALL_ROLES=Object.values(RolesEnum);