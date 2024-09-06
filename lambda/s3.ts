import { GetObjectCommand, ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const MAX_AGE = 24 * 3600
let s3: S3Client

const bootstrap = () => {
  if (!s3) {
    s3 = new S3Client({})
  }
}

export const readFromS3AsString = async ({ Bucket, Key }: { Bucket: string; Key: string }): Promise<string> => {
  bootstrap()
  const params = new GetObjectCommand({
    Bucket,
    Key,
  })
  const data = await s3.send(params)
  if (data.Body) {
    const body = await data.Body.transformToByteArray()
    return Buffer.from(body).toString()
  }
  throw new Error('Invalid / empty file')
}

export const writeToS3 = async ({
  Bucket,
  Key,
  Body,
  ContentType,
}: {
  Bucket: string
  Key: string
  Body: Buffer
  ContentType: string
}): Promise<void> => {
  bootstrap()
  const upload = new PutObjectCommand({
    Bucket,
    Key,
    Body,
    ContentType,
    Metadata: {},
    CacheControl: `private, max-age=${MAX_AGE}`,
    ACL: ObjectCannedACL.private,
  })
  await s3.send(upload)
  return
}
