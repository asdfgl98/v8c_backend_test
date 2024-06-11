import { BadRequestException, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ImageUrl } from './entities/imageUrl.entity';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports:[
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Post, ImageUrl]),
    AwsModule,
    MulterModule.register({
      limits:{
        fileSize: 10000000
      },
      fileFilter: (req, file, cb)=>{
        const ext = extname(file.originalname)

        if(ext !== '.jpg' && ext !=='.jpeg' && ext !== '.png'){
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false
          )
        }
        
        return cb(null, true)
      }
    })
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
