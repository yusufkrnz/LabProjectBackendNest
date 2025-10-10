"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_constants_1 = require("../../constants/auth.constants");
let JwtAuthService = class JwtAuthService {
    jwt;
    constructor(jwt) {
        this.jwt = jwt;
    }
    signAccessToken(payload) {
        return this.jwt.sign(payload, { expiresIn: auth_constants_1.ACCESS_TOKEN_EXPIRATION });
    }
    signRefreshToken(payload) {
        return this.jwt.sign(payload, { expiresIn: auth_constants_1.REFRESH_TOKEN_EXPIRATION });
    }
    verify(token) {
        return this.jwt.verify(token);
    }
    decode(token) {
        return this.jwt.decode(token);
    }
};
exports.JwtAuthService = JwtAuthService;
exports.JwtAuthService = JwtAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], JwtAuthService);
//# sourceMappingURL=jwt.service.js.map