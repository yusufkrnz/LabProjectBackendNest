import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User,UserSchema } from "src/schemas/user.schema";
import { PreloginController } from "./prelogin.controller";
import { PreloginService } from "./prelogin.service";
import { CommonModule } from "src/common/common.module";





@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        CommonModule,
    ],
    controllers:[PreloginController],
    providers:[PreloginService],
    exports:[PreloginService],
})

export class PreloginModule{}