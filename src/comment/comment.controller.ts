import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 작성', description: '게시물에 댓글을 작성합니다.' })
  @ApiResponse({ status: 201, description: '댓글이 성공적으로 생성되었습니다.'})
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any
  ) {
    return this.commentService.create(createCommentDto, req.user.sub);
  }

  @Get(':postId')
  @ApiOperation({ summary: '게시물의 댓글 조회', description: '특정 게시물의 모든 댓글을 조회합니다.' })
  @ApiParam({ name: 'postId', type: String, description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '포스트에 대한 댓글 반환.' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  find(@Param('postId') postId: string) {
    return this.commentService.find(postId);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 수정', description: '특정 댓글을 수정합니다.' })
  @ApiParam({ name: 'commentId', type: String, description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 수정되었습니다.'})
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any
  ) {
    return this.commentService.update(+commentId, updateCommentDto, req.user.sub);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제', description: '특정 댓글을 삭제합니다.' })
  @ApiParam({ name: 'commentId', type: String, description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 삭제되었습니다.'})
  @ApiResponse({ status: 401, description: '인증되지 않음' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  remove(
    @Param('commentId') commentId: string,
    @Request() req: any
  ) {
    return this.commentService.softDelete(+commentId, req.user.sub);
  }
}
