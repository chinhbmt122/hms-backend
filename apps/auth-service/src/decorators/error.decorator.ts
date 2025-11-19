// catch-error.decorator.ts
import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common'

export function CatchError(messageFn: (...args: any[]) => string, httpStatus: HttpStatus) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = async function (...args: any[]) {
      try {
        return await original.apply(this, args)
      } catch (err) {
        console.error(err)
        throw new HttpException(messageFn(...args), httpStatus)
      }
    }
  }
}

export function CatchServerError(message: (...args: any[]) => string) {
  return CatchError(message, HttpStatus.INTERNAL_SERVER_ERROR)
}
