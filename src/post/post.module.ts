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
import * as multer from 'multer';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import {v4 as uuid} from 'uuid'

@Module({
  imports:[
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Post, ImageUrl]),
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
      },
      storage: multer.diskStorage({
        destination: function(req, res, cb){
          cb(null, POST_IMAGE_PATH)
        },
        filename: function(req, file, cb){
          cb(null, `${uuid()}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
