import { IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    comment: string

    @IsString()
    postId: string

    @IsOptional()
    parentCommentId: string
}
