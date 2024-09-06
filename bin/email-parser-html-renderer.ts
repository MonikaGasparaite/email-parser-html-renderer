#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {EmailParserHtmlRendererStack} from '../lib/email-parser-html-renderer-stack';

const app = new cdk.App();
const { S3_BUCKET_NAME = '', S3_BUCKET_ARN = '' } = process.env

new EmailParserHtmlRendererStack(app, 'email-parser-html-renderer', {
    S3_BUCKET_NAME,
    S3_BUCKET_ARN,
})
