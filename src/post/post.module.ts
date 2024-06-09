import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ImageUrl } from './entities/imageUrl.entity';

@Module({
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Post, ImageUrl])
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
