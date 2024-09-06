### Deploy lambda function to AWS

* `npm install`
* `npm run build-layers`
* `npm run build`
* `export S3_BUCKET_NAME=bucket-name` 
* `export S3_BUCKET_ARN=arn:aws:s3:::bucket-name`
* `cdk bootstrap` 
* `cdk deploy` 

### Call lambda function:

`aws lambda invoke --function-name email-parser-html-renderer-lambda --payload '{"contentS3Key": "test-email.html", "outputS3Key": "generated-email", "pdf": true}' /dev/stdout`
