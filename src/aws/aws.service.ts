import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk'
import {v4 as uuid} from 'uuid'

@Injectable()
export class AwsService {
    private s3: AWS.S3
    constructor(private readonly configService: ConfigService){
        this.s3 = new AWS.S3({
            region: this.configService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.configService.get("AWS_ACCESS_KEY"),
                secretAccessKey: this.configService.get("AWS_SECRET_KEY")
            }
        })        
    }

    /** S3 이미지 업로드 */
    async uploadImage(file?: Express.Multer.File){
        if(!file){
            return;
        }
        const bucketName = this.configService.get("AWS_BUCKET_NAME")
        const fileName = `${uuid()}-${file.originalname}`
        const uploadData = {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType : file.mimetype
        }

        try{
            const upload = await this.s3.upload(uploadData).promise()
            return upload.Location
        } catch(err){
            console.error('s3 이미지 업로드 중 에러 발생', err)
            throw new BadRequestException('s3 이미지 업로드 중 에러 발생')
        }
    }


}
