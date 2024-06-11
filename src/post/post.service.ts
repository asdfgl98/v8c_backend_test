import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Between, FindOptionsOrderValue, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { ImageUrl } from './entities/imageUrl.entity';
import { filterWithDate, nowTime } from 'src/common/util';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(ImageUrl)
    private imageUrlRepository: Repository<ImageUrl>
  ){}

  async create(createPostDto: CreatePostDto, userId: User, imageUrl: string | null): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      author: userId,
    })

    if(imageUrl){
      const image = this.imageUrlRepository.create({
        url: imageUrl
      })
  
      post.imageUrl = [image]
    }

    try{      
      return await this.postRepository.save(post);

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
    const post = await this.postAuthorCheck(postId, userId)

    try{
      const removePost = await this.postRepository.softRemove(post)

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
      relations: ['author', 'imageUrl']
    })

    if(!findPost){
      throw new NotFoundException("게시물이 존재하지 않습니다.")
    }

    if(findPost.author.userId !== userId){
      throw new UnauthorizedException("작성자만 게시물을 수정 및 삭제 할 수 있습니다.")
    }

    return findPost
  }

  async select(orderBy?: string, filter?: string): Promise<Post[]>{
    if(orderBy === 'views'){
      const nowDate = nowTime(new Date())
      const filterDate = filterWithDate(filter)
      console.log(nowDate, filterDate)

      return await this.postRepository.find({
        relations: ['imageUrl'],
        where: {
          createdAt: Between(filterDate, nowDate)
        },
        order: { views: orderBy as FindOptionsOrderValue}
      })
    }
    
    
    return await this.postRepository.find({
      relations: ['imageUrl'],
      order: { createdAt: orderBy as FindOptionsOrderValue}
    })
  }

  
}
