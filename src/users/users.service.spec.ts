import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>
  let configService: ConfigService

  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('존재하는 유저인지 테스트', async () => {
      const user = {
        userId: 'asdfgl98',
        password: '123',
        name: 'jihun',
        role: 'user'
      } as User

      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('asdfgl98');
      expect(result).toBe(user);
    });

    it('유저가 존재하지 않을 때 테스트', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne('asdfgl98');
      expect(result).toBeNull();
    });
  });

  describe('join', () => {
    const createUserDto: CreateUserDto = {
      userId: 'asdfgl98',
      password: '123',
      name: 'jihun',
    }

    const user = {
      userId: 'asdfgl98',
      password: '123',
      name: 'jihun',
      role: 'user'
    } as User

    
    it('회원가입 시도 시, 아이디가 중복일 때 예외 테스트', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);

      await expect(service.join(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('회원가입 성공 테스트', async () => {      

      mockUsersRepository.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('10');
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      mockUsersRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword });
      mockUsersRepository.save.mockResolvedValue({ ...createUserDto, password: hashedPassword });

      const result = await service.join(createUserDto);

      expect(result).toEqual({ ...createUserDto, password: hashedPassword });
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });

    it('회원가입 실패 시 예외 테스트', async () => {

      mockUsersRepository.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('10');
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      mockUsersRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword });
      mockUsersRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.join(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});

