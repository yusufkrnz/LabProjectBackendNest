import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ROLES_KEY } from "./roles.decator";
import { Reflector } from '@nestjs/core'; 
import { ROLE_HIERARCHY } from "./roles.constants";
import { RolesEnum } from "./roles.enum";




@Injectable()
export class RolesGuard implements CanActivate{

constructor(private reflector:Reflector){}
canActivate(context: ExecutionContext): boolean {
    
 const requiredRoles=this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY,
    [
        context.getHandler(),
        context.getClass(),
    ]
 );
 if(!requiredRoles||requiredRoles.length===0) {
   return true;
 }


 const req  = context.switchToHttp().getRequest();
 
 // Gerçek JWT'den gelen user bilgisi
 const user = req.user;
 if(!user||!user.role) {
   throw new ForbiddenException('User role not found');
 }

 // Güvenli role mapping
 // düzeltilecek burası 
 // çünkü biz zaten hiyerarşik bir yapıda roles var 
 // ve bunu tekrar yazmak yerine ROLE_HIERARCHY kullanacağız.
 const roleLevels = {
   'admin': 2,
   'user': 1
 };

 const userLevel = roleLevels[user.role] || 0;
 const minReq = requiredRoles.length > 0 ? Math.max(...requiredRoles.map(r => roleLevels[r] || 0)) : 0;
 
 if(userLevel < minReq) {
   throw new ForbiddenException('Insufficient permissions');
 }

    return true;
}
}