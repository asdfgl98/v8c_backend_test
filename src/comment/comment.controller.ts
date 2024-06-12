import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any
  ) {
    return this.commentService.create(createCommentDto, req.user.sub);
  }

  @Get(':postId')
  find(@Param('postId') postId: string) {
    return this.commentService.find(postId);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any
  ) {
    return this.commentService.update(+commentId, updateCommentDto, req.user.sub);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  remove(
    @Param('commentId') commentId: string,
    @Request() req: any
  ) {
    return this.commentService.softDelete(+commentId, req.user.sub);
  }
}
