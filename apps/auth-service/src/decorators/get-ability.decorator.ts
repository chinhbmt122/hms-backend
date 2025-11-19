import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetCurrentAbility = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()
  const ability = request.ability
  return ability
})
