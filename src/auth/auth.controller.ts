import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

    return this.authService.userLogin(validateUser.userId)
  }

}
