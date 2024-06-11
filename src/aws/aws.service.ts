import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
    s3: S3Client
    constructor(private readonly configService: ConfigService){
        this.s3 = new S3Client({
            region: this.configService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.configService.get("AWS_ACCESS_KEY"),
                secretAccessKey: this.configService.get("AWS_SECRET_KEY")
            }
        })        
    }


}
