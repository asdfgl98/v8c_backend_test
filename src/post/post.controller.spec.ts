import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { AwsService } from 'src/aws/aws.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService
  let awsService: AwsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            select: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: AwsService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AccessTokenGuard)
    .useValue({canActivate: jest.fn(()=> true)})
    .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService)
    awsService = module.get<AwsService>(AwsService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('게시물 생성 controller 테스트', async () => {
      const createPostDto: CreatePostDto = {
        title: '테스트 게시물',
        content: '테스트 내용',
        category: '1:1문의'
      };

      const req = { user: { sub: 'asdfgl98' } };
      const file = { originalname: 'test.jpg', buffer: Buffer.from('test') } as Express.Multer.File;
      const imageUrl = 'http://example.com/test.jpg';

      const mockResultPost = {
        title: '테스트 게시물',
        content: '테스트 내용',
        category: '1:1문의',
        userId : 'asdfgl98'
      } as Post

      jest.spyOn(awsService, 'uploadImage').mockResolvedValue(imageUrl);
      jest.spyOn(postService, 'create').mockResolvedValue(mockResultPost);

      const result = await controller.create(createPostDto, req, file);

      expect(awsService.uploadImage).toHaveBeenCalledWith(file);
      expect(postService.create).toHaveBeenCalledWith(createPostDto, req.user.sub, req.user.sub, imageUrl);
      expect(result).toBe(mockResultPost);
    });
  });

  describe('update', () => {
    it('게시물 업데이트 controller 테스트', async () => {
      const updatePostDto: UpdatePostDto = { content: 'Updated Post' };
      const req = { user: { sub: 'asdfgl98' } };
      const postId = '1';

      jest.spyOn(postService, 'update').mockResolvedValue(true);

      const result = await controller.update(updatePostDto, { postId }, req);

      expect(postService.update).toHaveBeenCalledWith(updatePostDto, postId, req.user.sub);
      expect(result).toBe(true);
    });
  });

  describe('delete', () => {
    it('게시물 삭제 controller 테스트', async () => {
      const req = { user: { sub: 'asdfgl98' } };
      const postId = '1';

      const mockResultPost = {
        title: '테스트 게시물',
        content: '테스트 내용',
        category: '1:1문의',
        userId : 'asdfgl98'
      } as Post

      jest.spyOn(postService, 'softDelete').mockResolvedValue(mockResultPost);

      const result = await controller.delete({ postId }, req);

      expect(postService.softDelete).toHaveBeenCalledWith(postId, req.user.sub);
      expect(result).toBe(mockResultPost);
    });
  });

  describe('select', () => {
    it('게시물 조회 controller 테스트', async () => {
      const orderBy = 'DESC';
      const filter = 'year';

      const mockResultPost = [
        {
        title: '테스트 게시물1',
        content: '테스트 내용1',
        category: '1:1문의',
        userId : 'asdfgl98'
        },
        {
        title: '테스트 게시물2',
        content: '테스트 내용2',
        category: '1:1문의',
        userId : 'asdfgl98'
        },
      ] as Post[]

      jest.spyOn(postService, 'select').mockResolvedValue(mockResultPost);

      const result = await controller.select(orderBy, filter);

      expect(postService.select).toHaveBeenCalledWith(orderBy, filter);
      expect(result).toEqual(mockResultPost);
    });
  });

  describe('search', () => {
    it('게시물 검색 controller 테스트', async () => {
      const searchValue = '게시물1';
      const type = 'title';

      const mockResultPost = {
        title: '게시물1',
        content: '테스트 내용1',
        category: '1:1문의',
        userId : 'asdfgl98'
        } as Post
        

      jest.spyOn(postService, 'search').mockResolvedValue([mockResultPost]);

      const result = await controller.search(searchValue, type);

      expect(postService.search).toHaveBeenCalledWith(searchValue, type);
      expect(result).toEqual([mockResultPost]);
    });
  });


});
