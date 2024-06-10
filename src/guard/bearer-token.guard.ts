import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class BearerTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const rawToken = req.headers['authorization']

        if(!rawToken){
            throw new UnauthorizedException("Bearer 토큰이 존재하지 않습니다.")
        }
        const token = this.authService.extractTokenFromHeader(rawToken, true)

        const verify = this.authService.verifyToken(token)

        req.user = verify
        req.token = token

        return true
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()
        if(req.user.type !== 'access') {
            throw new UnauthorizedException("access 토큰이 아닙니다.")
        }

        return true
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()

        if(req.user.type !== 'refresh'){
            throw new UnauthorizedException("refresh 토큰이 아닙니다.")
        }       

        return true
    }
}