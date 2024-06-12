import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';

@Module({
  imports:[
    AuthModule,
    PostModule,
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
