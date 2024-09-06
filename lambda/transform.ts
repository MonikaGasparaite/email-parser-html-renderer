import {plainToInstance} from 'class-transformer'
import {validateOrReject} from 'class-validator'

function transform<T, P>(toType: any, value: P): T {
  return plainToInstance<T, unknown>(toType, value, {
    excludeExtraneousValues: true,
    exposeUnsetFields: false,
  }) as any as T
}

export async function toInstance<T extends object, P extends any>(
  toType: any,
  value: P | P[]
): Promise<T | T[]> {
  if (Array.isArray(value)) {
    return value.map((v) => transform<T, P>(toType, v))
  }
  const instance = transform<T, P>(toType, value) as T
  await validateOrReject(instance)
  return instance
}
