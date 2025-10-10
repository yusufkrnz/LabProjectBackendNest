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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostloginController = void 0;
const common_1 = require("@nestjs/common");
const postlogin_service_1 = require("./postlogin.service");
const jwt_guard_1 = require("../../common/auth/jwt/jwt.guard");
let PostloginController = class PostloginController {
    postloginService;
    constructor(postloginService) {
        this.postloginService = postloginService;
    }
    async refreshToken(body) {
        return this.postloginService.refreshToken(body.refreshToken);
    }
    async logout(req) {
        return this.postloginService.logout(req.user.userId);
    }
    async changePassword(req, body) {
        return this.postloginService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
    }
};
exports.PostloginController = PostloginController;
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostloginController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostloginController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostloginController.prototype, "changePassword", null);
exports.PostloginController = PostloginController = __decorate([
    (0, common_1.Controller)('postlogin'),
    __metadata("design:paramtypes", [postlogin_service_1.PostloginService])
], PostloginController);
//# sourceMappingURL=postlogin.controller.js.map