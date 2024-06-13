import { Test, TestingModule } from '@nestjs/testing';
import { AwsService } from './aws.service';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { BadRequestException } from '@nestjs/common';


jest.mock('aws-sdk', () => {
  const S3 = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return { S3: jest.fn(() => S3) };
});

describe('AwsService', () => {
  let service: AwsService;
  let s3: AWS.S3
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                AWS_REGION: 'us-east-1',
                AWS_ACCESS_KEY: 'testAccessKey',
                AWS_SECRET_KEY: 'testSecretKey',
                AWS_BUCKET_NAME: 'testBucketName',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AwsService>(AwsService);
    s3 = new AWS.S3();
    service['s3'] = s3;  

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('이미지 파일이 존재하지 않을 때 테스트', async () => {
      const result = await service.uploadImage();
      expect(result).toBeUndefined();
    });

    it('이미지를 AWS S3에 업로드 테스트', async () => {
      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const mockUploadResponse = {
        Location: 'https://s3.amazonaws.com/testBucketName/test.jpg',
      };

      jest.spyOn(s3, 'upload').mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockUploadResponse),
      } as any);

      const result = await service.uploadImage(file);
      expect(result).toBe(mockUploadResponse.Location);
      expect(s3.upload).toHaveBeenCalledWith({
        Bucket: 'testBucketName',
        Key: expect.any(String),
        Body: file.buffer,
        ContentType: file.mimetype,
      });
    });

    it('이미지 업로드 중 오류 발생 시 예외 테스트', async () => {
      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      jest.spyOn(s3, 'upload').mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('Upload error')),
      } as any);

      await expect(service.uploadImage(file)).rejects.toThrow(BadRequestException);
    });
  });

});
