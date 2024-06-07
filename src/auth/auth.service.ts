import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    join(userData: any){

    }

    generationToken(id: string, isRefreshToken: boolean){
        const payload = {
            sub : id,
            type : isRefreshToken ? 'refresh' : 'access'
        }

        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn : isRefreshToken ? 1000 * 60 * 60 * 24 * 7 : 3600
        })
    }

    userLogin(id: string){
        return {
            accessToken : this.generationToken(id, false),
            refreshToken : this.generationToken(id, true)
        }
    }



}
