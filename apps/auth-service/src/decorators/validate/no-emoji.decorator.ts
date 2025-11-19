import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator'

@ValidatorConstraint({ name: 'containsNoEmoji', async: false })
export class ContainsNoEmoji implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi
    return typeof text === 'string' && !emojiRegex.test(text)
  }

  defaultMessage(args: ValidationArguments) {
    return 'Text must not contain emoji.'
  }
}

export function NoEmoji(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'noEmoji',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ContainsNoEmoji
    })
  }
}
