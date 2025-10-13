import { Controller, Get ,Post,Delete,Param,Body, UseGuards} from "@nestjs/common";
import { PreloginService } from "./prelogin.service";
import { User,UserSchema } from "src/schemas/user.schema";
import { RolesEnum } from "src/common/decators/roles/roles.enum";
import { ROLE_HIERARCHY } from "src/common/decators/roles/roles.constants";
import { Roles, RolesGuard } from "src/common/auth/guards/roles.guard";
import { JwtAuthGuard } from "src/common/auth/jwt/jwt.guard";



@Controller('prelogin')
export class PreloginController{


 constructor(private readonly preloginService:PreloginService){}

 @UseGuards(JwtAuthGuard, RolesGuard)
 @Roles(RolesEnum.ADMIN)
 @Get('users')
 async getAllUsers():Promise<User[]>{
    return this.preloginService.findAllUsers();
}



@Post('validate')
async validateCredentials(@Body() body:{username:string;password:string}){
    return this.preloginService.validateCredentials(body.username,body.password);
}

}