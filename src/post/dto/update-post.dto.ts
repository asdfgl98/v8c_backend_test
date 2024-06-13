import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: '테스트 내용 수정!', description: '수정 내용' })
    readonly content: string
}
