import * as cdk from 'aws-cdk-lib'
import {Code, LayerVersion, Runtime} from 'aws-cdk-lib/aws-lambda'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'
import {Bucket} from 'aws-cdk-lib/aws-s3'
import {Construct} from 'constructs'

export interface StackProps extends cdk.StackProps {
  S3_BUCKET_NAME: string
  S3_BUCKET_ARN: string
}

export class EmailParserHtmlRendererStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const { S3_BUCKET_NAME, S3_BUCKET_ARN } = props

    const chromeAwsLayer = new LayerVersion(this, `Chrome AWS Layer`, {
      layerVersionName: `visma-email-parser-chrome-aws-lambda`,
      code: Code.fromAsset('layer/chrome/chrome_aws_lambda.zip'),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'Headless Chrome with puppeteer',
    })

    const dependenciesLayer = new LayerVersion(this, 'Node.js dependencies layer', {
      layerVersionName: `visma-email-parser-dependency`,
      code: Code.fromAsset('layer/dependencies/node_dependencies.zip'),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'A layer containing Node.js modules',
    });

    const rendererLambda = new cdk.aws_lambda.Function(this, `Renderer lambda`, {
      functionName: 'visma-email-parser-html-renderer-lambda',
      code: Code.fromAsset('lambda'),
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_20_X,
      layers: [chromeAwsLayer, dependenciesLayer],
      environment: {
        S3_BUCKET_NAME,
      },
      memorySize: 2048,
      timeout: cdk.Duration.seconds(30),
      logRetention: RetentionDays.ONE_WEEK,
    })

    const bucket = Bucket.fromBucketArn(this, 'Bucket', S3_BUCKET_ARN)
    bucket.grantReadWrite(rendererLambda)
    bucket.grantPut(rendererLambda)
    bucket.grantPutAcl(rendererLambda)

    new cdk.CfnOutput(this, `Lambda:`, {
      value: `${rendererLambda.functionArn}`,
    })
  }
}
