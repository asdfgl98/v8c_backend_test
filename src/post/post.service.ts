import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ){}

  async create(createPostDto: CreatePostDto, userId: User): Promise<boolean> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: userId,
    })

    try{
      await this.postRepository.save(post)
      return true;

    } catch(err){
      console.error('게시물 생성 오류 발생', err)
      throw new InternalServerErrorException("게시물 생성 오류")
    }
  }

  async update(updatePostDto: UpdatePostDto, postId: string, userId: string): Promise<boolean>{
    await this.postAuthorCheck(postId, userId)

    try{
      const update = await this.postRepository.update(
        {postId},
        updatePostDto
      )
      
      if(!update.affected){
        throw new BadRequestException("게시물 업데이트가 적용되지 않았습니다.")
      }
        
        return true
    } catch(err){
      throw new BadRequestException("게시물 업데이트 중 에러가 발생했습니다.")
    }
    
    
  }

  async softDelete(postId: string, userId: string){
    await this.postAuthorCheck(postId, userId)

    try{
      const removePost = await this.postRepository.softDelete(
        {postId}
      )

      return true

    } catch(err){
      throw new BadRequestException("게시물 삭제 중 오류가 발생했습니다.")
    }


    
    
  }

  async postAuthorCheck(postId: string, userId: string){
    const findPost = await this.postRepository.findOne({
      where: {
        postId
      },
      relations: ['author']
    })

    if(!findPost){
      throw new NotFoundException("게시물이 존재하지 않습니다.")
    }

    if(findPost.author.userId !== userId){
      throw new UnauthorizedException("작성자만 게시물을 수정 및 삭제 할 수 있습니다.")
    }

    return true
  }

  async select(): Promise<Post[]>{
    return await this.postRepository.find()
  }

  
}
