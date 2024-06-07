import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>
    ){}

    async join(userData: CreateUserDto){
        const joinResult = await this.usersService.join(userData)
        
        return this.userLogin(joinResult.userId)
    }

    async validateUser(userId: string, password: string){
        const user = await this.usersService.findOne(userId)

        if(user && await bcrypt.compare(password, user.password)){
            const {password, ...result} = user
            return result
        }

        return false
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
