import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AccessTokenGuard } from 'src/guard/bearer-token.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    const imageUrl = await this.awsService.uploadImage(file)
    return await this.postService.create(createPostDto, req.user.sub, imageUrl);

  }

  @Patch(':postId')
  @UseGuards(AccessTokenGuard)
  update(
    @Body() updatePostDto: UpdatePostDto,
    @Param() {postId},
    @Request() req: any
  ) {
    return this.postService.update(updatePostDto, postId, req.user.sub)    
  }

  @Delete(':postId')
  @UseGuards(AccessTokenGuard)
  delete(
    @Param() {postId},
    @Request() req:any
  ) {
    return this.postService.softDelete(postId, req.user.sub)
  }

  @Get()
  select(){
    return this.postService.select()
  }
  


  
}
