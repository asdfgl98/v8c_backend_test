import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    @ApiProperty({ example: '게시물 테스트1', description: '게시물 제목' })
    readonly title: string

    @IsString()
    @ApiProperty({ example: '테스트 내용1', description: '게시물 내용' })
    readonly content: string

    @IsString()
    @ApiProperty({ example: '1:1문의', description: '카테고리' })
    readonly category: string
}
