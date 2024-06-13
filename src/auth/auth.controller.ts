import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard, BearerTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth Controller')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  @ApiOperation({
    summary: '회원가입',
    description: '사용자 정보를 입력 받아 회원가입 후, 로그인 처리를 하여 accessToken과 refreshToken을 반환 합니다.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '회원가입 성공.' })
  @ApiResponse({ status: 400, description: '잘못된 요청.' })
  async join(@Body() userData: CreateUserDto){
    const join = await this.authService.join(userData)
    return join
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
    description: '아이디와 비밀번호를 입력 받아 로그인 처리를 하여 accessToken과 refreshToken을 반환 합니다.',
  })
  @ApiBody({ schema: { properties: { userId: {example: "test12"}, password: {example:  "test@1234"} } } })
  @ApiResponse({ status: 200, description: '로그인 성공.' })
  @ApiResponse({ status: 400, description: '아이디 또는 비밀번호가 일치하지 않습니다.' })
  async login(@Body() req:any){
    const validateUser = await this.authService.validateUser(req.userId, req.password)
    if(!validateUser){
      throw new BadRequestException('아이디 또는 비밀번호가 일치하지않습니다.')      
    }
    return this.authService.userLogin(validateUser)
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: '토큰 갱신',
    description: 'Refresh Token을 이용하여 Access Token을 갱신 합니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '토큰 갱신 성공.' })
  @ApiResponse({ status: 401, description: '인증 실패.' })
  async refresh(@Request() req:any){
    const result = await this.authService.refreshAccessToken(req.token, false)

    return result
  }

}
