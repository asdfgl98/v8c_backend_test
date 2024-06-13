import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthService } from 'src/auth/auth.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            softDelete: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            extractTokenFromHeader: jest.fn(),
            verifyToken: jest.fn()
          }
        }
      ],
    })
    .overrideGuard(AccessTokenGuard)
    .useValue({canActivate: jest.fn(()=> true)})
    .compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService)
    authService = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(commentService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('createComment', ()=>{
    it('댓글 생성 controller 테스트', async ()=>{
      const createCommentDto: CreateCommentDto = { 
        comment : 'Test comment',
        postId : '1',
        parentCommentId : null
      }
      const req = {user: {sub : 'asdfgl98'}}

      jest.spyOn(commentService, 'create').mockImplementation(async () => ({
        id: 1,
        comment: 'Test comment',
        postId: '1',
        parentCommentId: null,
        userId: 'asdfgl98',  
      } as any));

      await controller.create(createCommentDto, req)

      expect(commentService.create).toHaveBeenCalledWith(createCommentDto, 'asdfgl98')
    })
  })

  describe('commentFind',()=>{
    it('댓글 조회 controller 테스트', async()=>{
      const postId = '1'
      const expectedComments = [
        {
          id: 1,
          comment: 'Test comment 1',
          postId: '1',
          parentCommentId: null,
          userId: 'asdfgl98',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          parent: null,
          children: [],
        },
      ];

      jest.spyOn(commentService, 'find').mockResolvedValue(expectedComments as any)

      const result = await controller.find(postId)

      expect(commentService.find).toHaveBeenCalledWith(postId)
      expect(result).toEqual(expectedComments)
    })
  })

  describe('commentUpdate', ()=>{
    it('댓글 수정 controller 테스트', async ()=>{
      const commentId = '1'
      const updateCommentDto : UpdateCommentDto = {
        comment : "update comment"
      }
      const req = {user: {sub: 'asdfgl98'}}

      jest.spyOn(commentService, 'update').mockImplementation(async () => ({
        id: 1,
        comment: 'update comment',
        postId: '1',
        parentCommentId: null,
        userId: 'asdfgl98',  
      } as any));

      await controller.update(commentId, updateCommentDto, req)

      expect(commentService.update).toHaveBeenCalledWith(+commentId, updateCommentDto, req.user.sub)

    })
  })

  describe('commentDelete', ()=>{
    it('댓글 소프트 삭제 controller 테스트', async ()=>{
      const commentId = '1'
      const req = {user: {sub: 'asdfgl98'}}

      jest.spyOn(commentService, 'softDelete').mockReturnValue(true as any)

      await controller.remove(commentId, req)

      expect(commentService.softDelete).toHaveBeenCalledWith(+commentId, req.user.sub)
    })
  })

});
