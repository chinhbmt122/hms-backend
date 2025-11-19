import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function IsOrderSequential(orderField?: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOrderSequential',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [orderField],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!Array.isArray(value)) return false

          const [field] = args.constraints

          const orders = field ? value.map((item) => item?.[field]) : value

          const validNumbers = orders.filter((v) => typeof v === 'number')

          // So sánh mảng đã sort với [1, 2, ..., N]
          const sorted = [...validNumbers].sort((a, b) => a - b)

          for (let i = 0; i < sorted.length; i++) {
            if (sorted[i] !== i + 1) return false
          }

          return true
        },
        defaultMessage(args: ValidationArguments) {
          const [field] = args.constraints
          return field
            ? `Array field "${field}" must be sequential starting from 1 (e.g. 1, 2, 3, ...)`
            : `Array must contain sequential numbers starting from 1 (e.g. 1, 2, 3, ...)`
        }
      }
    })
  }
}
