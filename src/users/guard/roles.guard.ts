import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate  {
    constructor(
        private readonly reflector: Reflector
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const requiredRole = this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if(!requiredRole){
            return true
        }

        const {user} = context.switchToHttp().getRequest()
        
        if(!user){
            throw new UnauthorizedException("로그인이 필요한 작업입니다.")
        }

        if(user.role !== requiredRole){
            throw new ForbiddenException(
                "이 작업을 수행할 권한이 없습니다. 권한을 확인해주세요."
            )
        }

        return true
    }
}