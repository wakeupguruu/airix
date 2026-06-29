package config

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)


type S3Client struct {
	client *s3.Client
	bucket string
	region string
}


func ConnectS3() (*S3Client, error) {
	cfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithRegion(os.Getenv("AWS_REGION")),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(
				os.Getenv("AWS_ACCESS_KEY_ID"),
				os.Getenv("AWS_SECRET_ACCESS_KEY"),
				"",
			),
		),
	)

	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	return &S3Client{
		client: s3.NewFromConfig(cfg),
		bucket: os.Getenv("BUCKET_NAME"),
		region: os.Getenv("AWS_REGION"),
	}, nil
}


func (s *S3Client) UploadFile(ctx context.Context, key string, file io.Reader) (string, error) {
	uploader := manager.NewUploader(s.client)

	result, err := uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
		Body:   file,
	})

	if err != nil {
		return "", fmt.Errorf("failed to upload file to S3: %w", err)
	}

	return result.Location, nil
}


func (s *S3Client) DeleteFile(ctx context.Context, key string) error {                         
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{                                   
		Bucket: aws.String(s.bucket),                                                                 
		Key:    aws.String(key),                                                                      
	})                                                                                            
	if err != nil {                                                                               
		return fmt.Errorf("failed to delete file from S3: %w", err)                                   
	}                                                                                             
	return nil                                                                                    
}