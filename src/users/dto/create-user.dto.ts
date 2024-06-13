import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'test12', description: '사용자 아이디' })
    @IsString()
    readonly userId: string;

    @ApiProperty({ example: 'test@1234', description: '비밀번호' })
    @IsString()
    readonly password: string;

    @ApiProperty({ example: 'testUser', description: '사용자 이름' })
    @IsString()
    readonly name: string;
}
