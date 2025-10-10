"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_ISSUER = exports.REFRESH_TOKEN_EXPIRATION = exports.ACCESS_TOKEN_EXPIRATION = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
exports.ACCESS_TOKEN_EXPIRATION = '15m';
exports.REFRESH_TOKEN_EXPIRATION = '7d';
exports.JWT_ISSUER = 'my-nest-app';
//# sourceMappingURL=auth.constants.js.map