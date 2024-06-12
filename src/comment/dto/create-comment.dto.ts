import { IsOptional, IsString } from "class-validator";
import { Comment } from "../entities/comment.entity";

export class CreateCommentDto {
    @IsString()
    comment: string

    @IsString()
    postId: string

    @IsString()
    @IsOptional()
    parentCommentId: number
}
