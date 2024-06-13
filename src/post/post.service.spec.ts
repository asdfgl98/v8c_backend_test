import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { ImageUrl } from './entities/imageUrl.entity';
import { UsersService } from 'src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: Repository<Post>
  let imageUrlRepository: Repository<ImageUrl>
  let usersService: UsersService

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softRemove: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    }),
  };

  const mockImageUrlRepository = {
    create: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        { provide: getRepositoryToken(ImageUrl), useValue: mockImageUrlRepository },
        { provide: UsersService, useValue: mockUserService },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    imageUrlRepository = module.get<Repository<ImageUrl>>(getRepositoryToken(ImageUrl));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('create', () => {
    it('게시물 생성 시도 시 존재하지 않는 회원일 때 예외 테스트', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(
        postService.create(new CreatePostDto(), new User(), 'asdfgl98', null),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('admin 권한이 아닐 때 공지사항 생성 시도 시 예외 테스트', async () => {
      const user = new User();
      user.role = 'user';
      mockUserService.findOne.mockResolvedValue(user);

      const createPostDto: CreatePostDto = {
        title: '테스트',
        content: '테스트 내용',
        category: '공지사항'
      } 

      await expect(
        postService.create(createPostDto, user, 'asdfgl98', null),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('게시물 생성 테스트', async () => {
      const user = new User();
      user.role = 'user';
      mockUserService.findOne.mockResolvedValue(user);

      const createPostDto: CreatePostDto = {
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의'
      } 
      mockPostRepository.create.mockReturnValue(createPostDto);
      mockPostRepository.save.mockResolvedValue(createPostDto);

      const result = await postService.create(createPostDto, user, 'userId', null);

      expect(result).toBe(createPostDto);
      expect(mockPostRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('게시물 업데이트 테스트', async () => {
      const updatePostDto: UpdatePostDto = {
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의'
      }
      jest.spyOn(postService, 'postAuthCheck').mockResolvedValue({} as Post)
      mockPostRepository.update.mockResolvedValue({ affected: 1 });

      const result = await postService.update(updatePostDto, '1', 'asdfgl98');

      expect(result).toBe(true);
    });

    it('게시물 업데이트가 적용되지 않았을 때 예외 테스트', async () => {
      const updatePostDto: UpdatePostDto = {
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의'
      } 
      
      jest.spyOn(postService, 'postAuthCheck').mockResolvedValue({} as Post)
      mockPostRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        postService.update(updatePostDto, '1', 'asdfgl98'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('softDelete', () => {
    it('게시물 삭제 테스트', async () => {
      const mockPost = {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        }
      } as Post

      jest.spyOn(postService, 'postAuthCheck').mockResolvedValue({} as Post)

      mockPostRepository.findOne.mockResolvedValue(mockPost);
      mockPostRepository.softRemove.mockResolvedValue(mockPost);

      const result = await postService.softDelete('1', 'asdfgl98');

      expect(result).toBe(mockPost);
    });
  });

  describe('postAuthCheck', () => {
    it('게시물 수정 및 삭제 시도 시 게시물이 존재하지 않을 때 예외 테스트', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(
        postService.postAuthCheck('1', 'asdfgl98'),
      ).rejects.toThrow(NotFoundException);
    });

    it('게시물 수정 및 삭제 시도 시 게시물 작성자가 아닐 때 예외 테스트', async () => {
      const mockPost = {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        }
      } as Post

      mockPostRepository.findOne.mockResolvedValue(mockPost);

      await expect(
        postService.postAuthCheck('1', 'asdfgl77'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('게시물에 대한 권한 검증 테스트', async () => {
      const mockPost = {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        }
      } as Post

      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await postService.postAuthCheck('1', 'asdfgl98');

      expect(result).toBe(mockPost);
    });
  });

  describe('select', () => {
    it('게시물 조회(필터) 테스트', async () => {
      const mockPosts = [
        {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        },
      },
        {
        postId: '2',
        title: '테스트2',
        content: '테스트 내용2',
        category: '1:1문의',
        author: {
          userId: 'asdfgl981'
        },
      }
    ] as Post[]

      mockPostRepository.find.mockResolvedValue(mockPosts);

      const result = await postService.select('DESC', 'month');

      expect(result).toBe(mockPosts);
    });

    it('게시물 조회(필터x) 테스트', async () => {
      const mockPosts = [
        {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        },
      },
        {
        postId: '2',
        title: '테스트2',
        content: '테스트 내용2',
        category: '1:1문의',
        author: {
          userId: 'asdfgl981'
        },
      }
    ] as Post[]
      mockPostRepository.find.mockResolvedValue(mockPosts);

      const result = await postService.select('DESC');

      expect(result).toBe(mockPosts);
    });
  });

  describe('search', () => {
    it('게시물 제목으로 검색 테스트', async () => {
      const mockPosts = [
        {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        },
      },
        {
        postId: '2',
        title: '테스트2',
        content: '테스트 내용2',
        category: '1:1문의',
        author: {
          userId: 'asdfgl981'
        },
      }
    ] as Post[]
      mockPostRepository.createQueryBuilder().getMany.mockResolvedValue(mockPosts);

      const result = await postService.search('테스트', 'title');

      expect(result).toBe(mockPosts);
    });

    it('작성자로 게시물 검색 테스트', async () => {
      const mockPosts = [
        {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        },
      }
    ] as Post[]

      mockPostRepository.createQueryBuilder().getMany.mockResolvedValue(mockPosts);

      const result = await postService.search('asdfgl98', 'userId');

      expect(result).toBe(mockPosts);
    });
  });

  describe('findPost', () => {
    it('should find post by postId', async () => {
      const mockPosts = [
        {
        postId: '1',
        title: '테스트',
        content: '테스트 내용',
        category: '1:1문의',
        author: {
          userId: 'asdfgl98'
        },
      }
    ] as Post[]
    
      mockPostRepository.findOne.mockResolvedValue(mockPosts);

      const result = await postService.findPost('1');

      expect(result).toBe(mockPosts);
    });
  });

});
