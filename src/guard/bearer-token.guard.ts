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

        const verify = this.authService.verifyToken(token, false)

        req.userId = verify.userId

        return true
    }
}