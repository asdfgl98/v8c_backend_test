import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}

  async findOne(userId: string){
    return await this.usersRepository.findOne({where: {userId}})
  }

  async join(user: CreateUserDto) {
    const duplicateCheck = await this.findOne(user.userId)
    if(duplicateCheck){
      throw new BadRequestException('중복된 아이디입니다.')
    }

    const hash = await bcrypt.hash(
      user.password,
      Number(this.configService.get('HASH_ROUND'))
    )

    const join = this.usersRepository.create({
      ...user,
      password: hash
    })

    try{
      return await this.usersRepository.save(join)

    } catch(err) {
      throw new InternalServerErrorException('회원가입에 실패했습니다.')
    }   
  }

  

}
