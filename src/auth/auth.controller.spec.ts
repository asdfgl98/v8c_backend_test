import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';



describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          join: jest.fn(),
          validateUser: jest.fn(),
          userLogin: jest.fn((): any=>{}),
          refreshAccessToken: jest.fn()
        }
      }],
    })
    .overrideGuard(RefreshTokenGuard)
    .useValue({canActivate: jest.fn(()=> true)})
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authJoin', ()=>{
    it('auth controller 회원가입 테스트', async()=>{
      const userData : CreateUserDto = {
        name: 'jihun',
        password: '1234',
        userId: 'jihun123'
      }

      await controller.join(userData)

      expect(service.join).toHaveBeenCalledWith(userData)
    })
  })

  describe('authLogin', ()=>{
    it('auth controller 로그인 시도 시 아이디 / 패스워드 검증 예외 test', async()=>{
      const req = {userId: 'jihun123', password: '1234'}

      jest.spyOn(service, 'validateUser').mockResolvedValue(false)

      await expect(controller.login(req)).rejects.toThrow(BadRequestException)
      await expect(controller.login(req)).rejects.toThrow('아이디 또는 비밀번호가 일치하지않습니다.')

    })

    it('auth controller 로그인 테스트', async()=>{
      const req = {userId: 'jihun123', password: '1234'}
      const mockUser = {
        userId: 'jihun123',
        role: 'user'
      } as User

      const mockUserLoginResult = {
        accessToken: 'asfasdf',
        refreshToken: 'asfddfg1'
      }

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser)
      jest.spyOn(service as any, 'userLogin').mockResolvedValue(mockUserLoginResult)

      const result = await controller.login(req)

      expect(result).toBe(mockUserLoginResult)
      expect(service.validateUser).toHaveBeenCalledWith(req.userId, req.password)
      expect(service.userLogin).toHaveBeenCalledWith(mockUser)

    })
  })

  describe('authRefreshToken',()=>{
    it('refresh Token으로 accessToken 재발급 test', async()=>{
      const req =  {token: 'asdfasdgf'}
      const mockReturnAcceeToken = 'newAcceeToken1fsad12'

      jest.spyOn(service, 'refreshAccessToken').mockResolvedValue(mockReturnAcceeToken)

      const result = await controller.refresh(req)

      expect(result).toBe(mockReturnAcceeToken)
      expect(service.refreshAccessToken).toHaveBeenCalledWith(req.token, false)
    })  
  })
});
