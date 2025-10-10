"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const login_module_1 = require("./login/login.module");
const common_module_1 = require("./common/common.module");
const health_module_1 = require("./health/health.module");
const utils_module_1 = require("./utils/utils.module");
const media_module_1 = require("./media/media.module");
const config_1 = require("@nestjs/config");
const schemas_module_1 = require("./schemas/schemas.module");
const users_module_1 = require("./users/users.module");
const prelogin_module_1 = require("./login/preLogin/prelogin.module");
const mongoose_1 = require("@nestjs/mongoose");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/lab_project_db'),
            login_module_1.LoginModule,
            common_module_1.CommonModule,
            schemas_module_1.SchemasModule,
            media_module_1.MediaModule,
            utils_module_1.UtilsModule,
            health_module_1.HealthModule,
            users_module_1.UsersModule,
            prelogin_module_1.PreloginModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map