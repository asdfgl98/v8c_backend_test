import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[ConfigService],
  controllers: [AwsController],
  providers: [AwsService],
  exports:[AwsService]
})
export class AwsModule {}
