import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private readonly postService: PostService
  ){}

  /** 댓글 CREATE */
  async create(createCommentDto: CreateCommentDto, userId: string) {
    const {comment, postId, parentCommentId} = createCommentDto
    const findPost = await this.postService.findPost(createCommentDto.postId)    

    if(!findPost){
      throw new BadRequestException("존재하지 않는 게시물입니다.")
    }

    const newComment = new Comment()
    newComment.comment = comment
    newComment.post = {postId} as Post
    newComment.user = {userId} as User

    if(parentCommentId){
      const parent =  await this.commentRepository.findOne({where: {id : parentCommentId}})

      if(!parent){
        throw new BadRequestException("상위 댓글이 존재하지 않습니다.")
      }

      newComment.parent = parent
    }

    try{
      return this.commentRepository.save(newComment)
    } catch(err){
      console.error("댓글 생성 중 오류 발생", err)
      throw new BadRequestException("댓글 생성 중 오류 발생")
    }

  }

  /** 게시물에 대한 전체 댓글 SELECT */
  async find(postId: string) {
    const findPost = await this.postService.findPost(postId)

    if(!findPost){
      throw new BadRequestException("존재하지 않는 게시물입니다.")
    }

    const queryBuilder = this.commentRepository.createQueryBuilder('comment')
    queryBuilder
      .where('comment.postId = :postId', {postId})
      .andWhere('comment.parentCommentId IS NULL')
      .leftJoinAndSelect('comment.children', 'children')
      .orderBy('comment.createdAt', "ASC")
      
    try{
      return await queryBuilder.getMany()
    } catch(err){
      console.error('댓글 조회 중 에러 발생', err)
      throw new BadRequestException("댓글 조회 중 에러가 발생하였습니다.")
    }
  }

  /** 댓글 UPDATE */
  async update(commentId: number, updateCommentDto: UpdateCommentDto, userId: string) {
    const findComment = await this.commentAuthCheck(commentId, userId)

    findComment.comment = updateCommentDto.comment

    try{
      return await this.commentRepository.save(findComment)
    } catch(err){
      console.error('댓글 수정 중 오류 발생', err)
      throw new BadRequestException("댓글 수정 중 오류가 발생했습니다.")
    }

  }

  /** 댓글 SOFT DELETE */
  async softDelete(commentId: number, userId: string) {
    const findComment = await this.commentAuthCheck(commentId, userId)

    try{
      await this.commentRepository.softRemove(findComment)
      return true
    } catch(err){
      throw new BadRequestException("댓글 삭제 중 오류가 발생했습니다.")
    }
  }

  /** 댓글 수정 및 삭제 권한 검증 */
  async commentAuthCheck(commentId: number, userId: string){
    const findComment = await this.commentRepository.findOne({where: {id: commentId}})

    if(!findComment){
      throw new BadRequestException("존재하지 않는 댓글입니다.")
    }

    if(findComment.userId !== userId){
      throw new BadRequestException("작성자만 댓글을 수정 및 삭제할 수 있습니다.")
    }

    return findComment
  }
}
