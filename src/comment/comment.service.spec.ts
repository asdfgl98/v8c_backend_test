import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { PostService } from 'src/post/post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from 'src/post/entities/post.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';

const mockCommentRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
  softRemove: jest.fn(),
}

const mockPostService = {
  findPost: jest.fn()
}

const mockComments = [
  {
    id: 1,
    comment: 'Test comment',
    postId: '1',
    parentCommentId: null,
    children: [],
    createdAt: new Date(),
  },
];

describe('CommentService', ()=>{
  let service: CommentService;
  let commentRepository: Repository<Comment>
  let postService: PostService

  beforeEach(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepository },
        { provide: PostService, useValue: mockPostService},
      ],
    }).compile()

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    postService = module.get<PostService>(PostService);

  })

  it('should be defined', ()=>{
    expect(service).toBeDefined()
  })

  describe('commentCreate', ()=>{
    it('댓글 생성 시도 시 게시물이 존재하지 않을 때 예외 test', async()=>{
      const createCommentDto: CreateCommentDto = {
        comment : 'test comment',
        postId : '1',
        parentCommentId : null
      }

      const userId = '1'
  
      jest.spyOn(postService, 'findPost').mockResolvedValue(null);

      await expect(service.create(createCommentDto, userId)).rejects.toThrow(BadRequestException)
      await expect(service.create(createCommentDto, userId)).rejects.toThrow("존재하지 않는 게시물입니다.")
    })

    it('댓글 생성 시도 시 상위 댓글이 존재하지 않는데 대댓글을 작성할 때 예외 test', async()=>{
      const createCommentDto: CreateCommentDto = {
        comment : 'test comment',
        postId : '1',
        parentCommentId : 99
      }

      const userId = '1'
  
      jest.spyOn(postService, 'findPost').mockResolvedValue({} as Post)
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(null)

      await expect(service.create(createCommentDto, userId)).rejects.toThrow(BadRequestException)
      await expect(service.create(createCommentDto, userId)).rejects.toThrow("상위 댓글이 존재하지 않습니다.")
    })

    it('댓글 생성 service 테스트', async ()=>{
      const createCommentDto: CreateCommentDto = {
        comment : 'test comment',
        postId : '1',
        parentCommentId : null
      }
  
      const userId = '1'
      const newComment = { id: 1, ...createCommentDto, userId } as Comment;
  
      jest.spyOn(postService, 'findPost').mockResolvedValue({} as Post);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(newComment);

      const result = await service.create(createCommentDto, userId);

      expect(postService.findPost).toHaveBeenCalledWith(createCommentDto.postId);
      expect(commentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        comment: createCommentDto.comment,
        post: { postId: createCommentDto.postId },
        user: { userId },
      }));
      
      expect(result).toEqual(newComment);
    })    
  })

  describe('commentSelect', ()=>{
    it('댓글 조회 시 게시물이 존재하지 않을 때 예외 test', async()=>{
      const postId = '1'

      jest.spyOn(postService, 'findPost').mockResolvedValue(null);

      await expect(service.find(postId)).rejects.toThrow(BadRequestException)
      await expect(service.find(postId)).rejects.toThrow("존재하지 않는 게시물입니다.")
    })

    it('댓글 조회 test', async()=>{
      const postId = '1'

      jest.spyOn(postService, 'findPost').mockResolvedValue({} as Post);
      
      const createQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockComments),
      }

      jest.spyOn(commentRepository, 'createQueryBuilder').mockReturnValueOnce(createQueryBuilder)

      const result = await service.find(postId)

      expect(result).toEqual(mockComments)
      expect(createQueryBuilder.where).toHaveBeenCalledWith('comment.postId = :postId', {postId})
      expect(createQueryBuilder.andWhere).toHaveBeenCalledWith('comment.parentCommentId IS NULL')
      expect(createQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('comment.children', 'children')
      expect(createQueryBuilder.orderBy).toHaveBeenCalledWith('comment.createdAt', "ASC")
    })
  })

  describe('commentAuthCheck', ()=>{
    it('댓글 수정 및 삭제 시도 시 댓글이 존재하지 않을 때 예외 test ', async()=>{
      const commentId = 1
      const userId = 'asdfgl98'

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(null)

      expect(service.commentAuthCheck(commentId, userId)).rejects.toThrow(BadRequestException)
      expect(service.commentAuthCheck(commentId, userId)).rejects.toThrow("존재하지 않는 댓글입니다.")

    })

    it('댓글 수정 및 삭제 시도 시 작성자가 아닐 때 예외 test', async()=>{
      const commentId = 1
      const userId = 'asdfgl98'

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue({
        userId : 'asdfgl123'
      } as Comment)

      await expect(service.commentAuthCheck(commentId, userId)).rejects.toThrow(BadRequestException)
      await expect(service.commentAuthCheck(commentId, userId)).rejects.toThrow("작성자만 댓글을 수정 및 삭제할 수 있습니다.")
    })
  })

  describe('updateComment', ()=>{
    it('댓글 생성 test', async()=>{
      const commentId = 1
      const updateCommentDto: UpdateCommentDto = {
        comment: 'update comment'
      }
      const userId = 'asdfgl98'

      jest.spyOn(service, 'commentAuthCheck').mockResolvedValue({
        id : 1,
        comment: 'old comment',
        userId: 'asdfgl98'
      } as Comment)

      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        id : 1,
        comment: 'update comment',
        userId: 'asdfgl98'
      } as Comment)

      const result = await service.update(commentId, updateCommentDto, userId)

      expect(result.id).toEqual(1)
      expect(result.userId).toEqual('asdfgl98')
      expect(result.comment).toEqual('update comment')
    })
  })

  describe('commentSoftDelete', ()=>{
    it('댓글 삭제 test', async()=>{
      const commentId = 1
      const userId = 'asdfgl98'
      const mockComment = {
        id : 1,
        comment: 'old comment',
        userId: 'asdfgl98'
      } as Comment

      jest.spyOn(service, 'commentAuthCheck').mockResolvedValue(mockComment)

      jest.spyOn(commentRepository, 'softRemove').mockResolvedValue(mockComment)

      const result = await service.softDelete(commentId, userId)

      expect(result).toEqual(true)
      expect(commentRepository.softRemove).toHaveBeenCalledWith(mockComment)

    })
  })

})



