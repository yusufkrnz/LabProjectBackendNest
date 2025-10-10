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
exports.PreloginController = void 0;
const common_1 = require("@nestjs/common");
const prelogin_service_1 = require("./prelogin.service");
let PreloginController = class PreloginController {
    preloginService;
    constructor(preloginService) {
        this.preloginService = preloginService;
    }
    async getAllUsers() {
        return this.preloginService.findAllUsers();
    }
    async login(body) {
        return this.preloginService.login(body.username, body.password);
    }
};
exports.PreloginController = PreloginController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PreloginController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PreloginController.prototype, "login", null);
exports.PreloginController = PreloginController = __decorate([
    (0, common_1.Controller)('prelogin'),
    __metadata("design:paramtypes", [prelogin_service_1.PreloginService])
], PreloginController);
//# sourceMappingURL=prelogin.controller.js.map