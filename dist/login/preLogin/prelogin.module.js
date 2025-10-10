"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloginModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const prelogin_controller_1 = require("./prelogin.controller");
const prelogin_service_1 = require("./prelogin.service");
const passport_1 = require("@nestjs/passport");
const jwt_strategy_1 = require("../../common/auth/jwt/jwt.strategy");
const common_module_1 = require("../../common/common.module");
let PreloginModule = class PreloginModule {
};
exports.PreloginModule = PreloginModule;
exports.PreloginModule = PreloginModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            common_module_1.CommonModule,
        ],
        controllers: [prelogin_controller_1.PreloginController],
        providers: [prelogin_service_1.PreloginService, jwt_strategy_1.JwtStrategy],
        exports: [prelogin_service_1.PreloginService],
    })
], PreloginModule);
//# sourceMappingURL=prelogin.module.js.map