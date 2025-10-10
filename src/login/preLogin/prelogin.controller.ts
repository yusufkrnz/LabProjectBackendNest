import { Controller, Get ,Post,Delete,Param,Body} from "@nestjs/common";
import { PreloginService } from "./prelogin.service";
import { User,UserSchema } from "src/schemas/user.schema";
import { RolesEnum } from "src/common/decators/roles/roles.enum";
import { ROLE_HIERARCHY } from "src/common/decators/roles/roles.constants";



@Controller('prelogin')
export class PreloginController{


 constructor(private readonly preloginService:PreloginService){}

 @Get('users')
async getAllUsers():Promise<User[]>{
    return this.preloginService.findAllUsers();
}



@Post('login')
async login(@Body() body:{username:string;password:string}){
    return this.preloginService.login(body.username,body.password);
}

}