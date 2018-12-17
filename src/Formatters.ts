import { ValidationError } from 'jsonschema';

export function formatValidatorErrors(errors: ValidationError[]) {
    return errors.map((error) => error.message).join(', ');
}
