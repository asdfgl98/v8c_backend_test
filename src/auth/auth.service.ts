import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ){}

    /** 유저 회원가입 후 로그인 처리 */
    async join(userData: CreateUserDto){
        const joinResult = await this.usersService.join(userData)
        
        return this.userLogin(joinResult)
    }

    /** 로그인 시도 시 ID / PASSWORD 검증 */
    async validateUser(userId: string, password: string){
        const user = await this.usersService.findOne(userId)

        if(user && await bcrypt.compare(password, user.password)){
            const {password, ...result} = user
            return result
        }

        return false
    }

    /** JWT 생성 */
    generationToken(user: any, isRefreshToken: boolean){
        const payload = {
            sub : user.userId,
            role : user.role,
            type : isRefreshToken ? 'refresh' : 'access'
        }

        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn : isRefreshToken ? 1000 * 60 * 60 * 24 * 7 : 3600
        })
    }

    /** JWT 반환 */
    userLogin(user: any){
        return {
            accessToken : this.generationToken(user, false),
            refreshToken : this.generationToken(user, true)
        }
    }

    /** JWT 검증 */
    verifyToken(token: string){
        try{
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET')
            })
            return payload
        } catch(err){
            if(err.message === "jwt expired"){
                throw new BadRequestException('토큰이 만료되었습니다.')
            }

            console.error('토큰 검증 에러', err)
            throw new BadRequestException('토큰 검증 중 에러가 발생하였습니다.')
        }
    }

    /** 헤더에서 TOKEN 추출 */
    extractTokenFromHeader(header: string, isBearer: boolean){
        const splitToken = header.split(" ")
        const prefix = isBearer ? 'Bearer' : 'Basic'
        if(splitToken.length !== 2 || splitToken[0] !== prefix){
            throw new UnauthorizedException("잘못된 토큰입니다.")
        }

        return splitToken[1]
    }

    /** 토큰 재발급 */
    async refreshAccessToken(token: string, isRefreshToken: boolean){
        const verify = await this.verifyToken(token)
        if(verify.type !== 'refresh'){
            throw new BadRequestException('토큰 재발급은 Refresh Token으로만 가능합니다.')
        }

        return this.generationToken(
            verify.sub,
            isRefreshToken
        )
        
    }



}
