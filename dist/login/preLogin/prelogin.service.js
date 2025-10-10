"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreloginService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let PreloginService = class PreloginService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async findAllUsers() {
        return this.userModel.find().exec();
    }
    async findUserById(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async createUser(body) {
        const createdUser = new this.userModel(body);
        return createdUser.save();
    }
    async updateUser(id, body) {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, body, { new: true }).exec();
        if (!updatedUser)
            throw new common_1.NotFoundException('User not found');
        return updatedUser;
    }
    async deleteUser(id) {
        const res = await this.userModel.findByIdAndDelete(id).exec();
        if (!res)
            throw new common_1.NotFoundException('User not found');
        return true;
    }
    async login(username, password) {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Invalid password');
        const payload = {
            sub: user._id,
            username: user.username,
            role: user.role,
            userId: user.userId
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m'
        });
        const refreshToken = this.jwtService.sign({ sub: user._id }, { expiresIn: '7d' });
        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await user.save();
        return {
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                userId: user.userId,
                username: user.username,
                role: user.role,
                eMail: user.eMail
            }
        };
    }
};
exports.PreloginService = PreloginService;
exports.PreloginService = PreloginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], PreloginService);
//# sourceMappingURL=prelogin.service.js.map