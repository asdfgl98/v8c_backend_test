import { IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @IsString()
    @ApiProperty({example: '댓글  테스트', description: '댓글'})
    comment: string

    @IsString()
    @ApiProperty({example: '1', description: '댓글을 작성할 게시물 ID'})
    postId: string

    @IsString()
    @IsOptional()
    @ApiProperty({example: '1', description: '대댓글인 경우 부모 댓글의 ID'})
    parentCommentId: number
}
