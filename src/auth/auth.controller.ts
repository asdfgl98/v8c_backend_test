import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard, BearerTokenGuard, RefreshTokenGuard } from 'src/guard/bearer-token.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesGuard } from 'src/users/guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  async join(@Body() userData: CreateUserDto){
    const join = await this.authService.join(userData)
    return join
  }

  @Post('login')
  async login(@Body() req:any){
    const validateUser = await this.authService.validateUser(req.userId, req.password)
    if(!validateUser){
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지않습니다.')      
    }
    return this.authService.userLogin(validateUser)
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Request() req:any){
    const result = await this.authService.refreshAccessToken(req.token, false)

    return result
  }

  @Post('test')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('user')
  async test(@Request() req:any){
    console.log(req.user)
  }
}
