import type { ObjectSchema, ValidationError } from 'joi';

export type ValidationSchema = ObjectSchema;

export const validate = async <T>(schema: ValidationSchema, value: Partial<T> | null): Promise<T> => {
  try {
    await schema.validateAsync(value, {
      abortEarly: false,
      convert: false,
      allowUnknown: true,
    });

    return value as T;
  } catch (error) {
    console.log('error', error);
    throw new Error(`Invalid payload ${(error as ValidationError).details.map(({ message }) => message)}`);
  }
};
