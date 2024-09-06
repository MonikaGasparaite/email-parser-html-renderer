import { Exclude, Expose } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsString} from 'class-validator'

@Exclude()
export class HtmlRendererInput {
  @Expose()
  @IsString()
  @IsNotEmpty()
  contentS3Key: string

  @Expose()
  @IsString()
  @IsNotEmpty()
  outputS3Key: string

  @Expose()
  @IsBoolean()
  pdf: boolean = true
}
