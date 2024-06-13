import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard'; 
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '게시물 생성' })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: '게시물 생성 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseInterceptors(FileInterceptor('image'))
  /** 게시물 생성 */
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const imageUrl = await this.awsService.uploadImage(file)
    return await this.postService.create(createPostDto, req.user.sub, req.user.sub, imageUrl);

  }

  @Patch(':postId')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '게시물 수정' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: '수정할 게시물의 ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: '게시물 수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  /** 게시물 업데이트 */
  update(
    @Body() updatePostDto: UpdatePostDto,
    @Param() {postId},
    @Request() req: any
  ) {
    return this.postService.update(updatePostDto, postId, req.user.sub)    
  }

  @Delete(':postId')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: '게시물 삭제' })
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: '삭제할 게시물의 ID' })
  @ApiResponse({ status: 200, description: '게시물 삭제 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  /** 게시물 삭제 */
  delete(
    @Param() {postId},
    @Request() req:any
  ) {
    return this.postService.softDelete(postId, req.user.sub)
  }

  @Get()
  @ApiOperation({ summary: '게시물 목록 조회' })
  @ApiResponse({ status: 200, description: '게시물 목록 조회 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiQuery({ name: 'orderBy', description: '정렬(DESC or ASC)', required: false })
  @ApiQuery({ name: 'filter', description: '필터 조건(year, month, week)', required: false })
  /** 게시물 조회 */
  select(
    @Query('orderBy') orderBy: string,
    @Query('filter') filter: string
  ) {
    return this.postService.select(orderBy, filter)
  }

  @Get('/search')
  @ApiOperation({ summary: '게시물 검색' })
  @ApiResponse({ status: 200, description: '게시물 검색 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiQuery({ name: 'searchValue', description: '검색어', required: true })
  @ApiQuery({ name: 'type', description: '검색 타입(title, userId)', required: false})
  /** 게시물 검색 */
  search(
    @Query('searchValue') searchValue: string,
    @Query('type') type?: string | null
  ){
    return this.postService.search(searchValue, type)
  }

  


  
}
