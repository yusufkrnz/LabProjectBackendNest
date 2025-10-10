"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_ROLES = exports.ROLE_HIERARCHY = exports.DEFAULT_ROLE = void 0;
const roles_enum_1 = require("./roles.enum");
exports.DEFAULT_ROLE = roles_enum_1.RolesEnum.USER;
exports.ROLE_HIERARCHY = {
    [roles_enum_1.RolesEnum.ADMIN]: 2,
    [roles_enum_1.RolesEnum.USER]: 1,
};
exports.ALL_ROLES = Object.values(roles_enum_1.RolesEnum);
//# sourceMappingURL=roles.constants.js.map