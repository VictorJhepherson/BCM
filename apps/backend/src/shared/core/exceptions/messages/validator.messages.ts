import { ValidationArguments } from 'class-validator';

export class ValidatorMessages {
  static isNotEmpty({ property }: ValidationArguments): string {
    return `The field ${property} should not be Empty`;
  }

  static isOptional({ property }: ValidationArguments): string {
    return `The field ${property} should be Optional`;
  }

  static isString({ property }: ValidationArguments): string {
    return `The field ${property} should be a String`;
  }

  static isEnum({ property, constraints }: ValidationArguments): string {
    return `The field ${property} should be a Enum of: ${Object.values(constraints[0]).join(', ')}`;
  }

  static isArray({ property }: ValidationArguments): string {
    return `The field ${property} should be a Array`;
  }

  static isMongoId({ property }: ValidationArguments): string {
    return `The field ${property} should be a ObjectId (mongo)`;
  }

  static isObject({ property }: ValidationArguments): string {
    return `The field ${property} should be a Object`;
  }

  static isBoolean({ property }: ValidationArguments): string {
    return `The field ${property} should be a Boolean`;
  }

  static isMatches({ property, constraints }: ValidationArguments): string {
    return `The field ${property} should match the pattern: ${constraints[0]}`;
  }
}
