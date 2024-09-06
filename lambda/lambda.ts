import { toInstance } from './transform'
import { HtmlRendererInput } from './types'
import { readFromS3AsString, writeToS3 } from './s3'
import { render } from './renderer'

const Bucket = process.env.S3_BUCKET_NAME ?? ''

export const handler = async (event: any, context: any, callback: any) => {
  console.log(`event=${JSON.stringify(event)}`)
  const input = (await toInstance(HtmlRendererInput, event)) as HtmlRendererInput
  const { contentS3Key, outputS3Key } = input
  const htmlContent = await readFromS3AsString({ Bucket, Key: contentS3Key })
  console.log(`htmlContent=${htmlContent}`)
  const Body = await render({ html: htmlContent, pdf: input.pdf})
  await writeToS3({ Bucket, Key: outputS3Key, Body, ContentType: 'text/plain' })

  return {
    outputS3Key,
  }
}
