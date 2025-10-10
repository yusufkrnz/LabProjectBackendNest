import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { User,UserSchema } from "src/schemas/user.schema";
import { PreloginController } from "./prelogin.controller";
import { PreloginService } from "./prelogin.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "src/common/auth/jwt/jwt.strategy";
import { CommonModule } from "src/common/common.module";





@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        CommonModule, // CommonModule'den JWT servis
    ],
    controllers:[PreloginController],
    providers:[PreloginService, JwtStrategy], // JwtStrategy 
    exports:[PreloginService],
})

export class PreloginModule{}