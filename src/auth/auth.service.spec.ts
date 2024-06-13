import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService
  let configService: ConfigService


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './config/.env.dev'
        })
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            join: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('join service', ()=>{
    it('회원가입 후 로그인 처리 테스트', async()=>{
      const userData: CreateUserDto = {
        userId: 'asdfgl98',
        password: '1234',
        name: 'jihun'
      }

      const mockUser = {
        userId: 'asdfgl98',
        name: 'jihun',
        password: await bcrypt.hash('1234', 10),
      } as User;

      const mockJwt = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      }

      jest.spyOn(usersService, 'join').mockResolvedValue(mockUser)
      jest.spyOn(service as any, 'userLogin').mockResolvedValue(mockJwt)

      const result = await service.join(userData)

      expect(usersService.join).toHaveBeenCalledWith(userData)
      expect(service.userLogin).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockJwt)
    })
  })

  describe('validateUser', ()=>{
    it('로그인 시도 시 ID / PASSWORD 검증 테스트', async()=>{
      const userId = 'asdfgl98'
      const password = '1234'

      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser = {
        userId: 'asdfgl98',
        password: hashedPassword,
      } as User;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser)

      const result = await service.validateUser(userId, password)

      expect(usersService.findOne).toHaveBeenCalledWith(userId)
      expect(result).toEqual({userId: 'asdfgl98'})
    })
  })

  describe('generationToken', ()=>{
    it('accessToken 생성 테스트', async()=>{
      const user = {
        userId : 'asdfgl98',
        role: 'user'
      }

      jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken')

      const result = service.generationToken(user, false)

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: 'asdfgl98',
          role: 'user',
          type: 'access'
        },
        { secret: undefined, expiresIn: 3600 }
      )
      expect(result).toBe('mockAccessToken')
    })

    it('refreshToken 생성 테스트', async()=>{
      const user = {
        userId : 'asdfgl98',
        role: 'user'
      }

      jest.spyOn(jwtService, 'sign').mockReturnValue('mockRefreshToken')

      const result = service.generationToken(user, true)

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          sub: 'asdfgl98',
          role: 'user',
          type: 'refresh'
        },
        { secret: undefined, expiresIn: 1000 * 60 * 60 * 24 * 7 }
      )
      expect(result).toBe('mockRefreshToken')
    })
  })

  describe('userLogin', ()=>{
    it('userLogin 테스트', async()=>{
      const user = {
        userId : 'asdfgl98',
        role: 'user'
      }

      jest.spyOn(jwtService, 'sign').mockImplementation((payload, options) => {
        return 'mockJWT'; 
      });

      const result = service.userLogin(user)

      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      })      
    })
  })

  describe('verifyToken', ()=>{
    it('토큰 검증 test', async()=>{
      const token = 'mockToken';
      const mockPayload = {
        sub: 'asdfgl98',
        role: 'user',
        type: 'access',
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);

      const result = service.verifyToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: undefined,
      });
      expect(result).toEqual(mockPayload);

    })

    it('토큰이 만료되었을 때 예외 테스트', () => {
      const token = 'expiredToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw { message: 'jwt expired' };
      });

      expect(() => service.verifyToken(token)).toThrow(BadRequestException);
      expect(() => service.verifyToken(token)).toThrow('토큰이 만료되었습니다.');
    });

    it('토큰 검증 중 에러 발생 시 예외 테스트', () => {
      const token = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Other token error');
      });

      expect(() => service.verifyToken(token)).toThrow(BadRequestException);
      expect(() => service.verifyToken(token)).toThrow(
        '토큰 검증 중 에러가 발생하였습니다.'
      );
    });
  })

  describe('extractTokenFromHeader', () => {
    it('헤더에서 토큰 추출 테스트', () => {
      const header = 'Bearer mockToken';
      const isBearer = true;

      const result = service.extractTokenFromHeader(header, isBearer);

      expect(result).toBe('mockToken');
    });

    it('토큰이 잘못된 형식으로 전달됬을 때 예외 테스트', () => {
      const header = 'InvalidHeader';
      const isBearer = true;

      expect(() => service.extractTokenFromHeader(header, isBearer)).toThrow(
        UnauthorizedException
      );
      expect(() => service.extractTokenFromHeader(header, isBearer)).toThrow(
        '잘못된 토큰입니다.'
      );
    });
  });

  
  describe('refreshAccessToken', () => {
    it('accessToken 재발급 테스트', async () => {
      const token = 'refreshToken';
      const mockPayload = {
        sub: 'testuser',
        role: 'user',
        type: 'refresh',
      };
      jest.spyOn(service, 'verifyToken').mockResolvedValue(mockPayload);
      jest.spyOn(service, 'generationToken').mockReturnValue('mockAccessToken');
  
      const result = await service.refreshAccessToken(token, false);
  
      expect(service.verifyToken).toHaveBeenCalledWith(token);
      expect(service.generationToken).toHaveBeenCalledWith(
        mockPayload.sub,
        false
      );
      expect(result).toBe('mockAccessToken');
    });
  })

    
 
  

});
