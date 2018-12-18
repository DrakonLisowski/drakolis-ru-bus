import { ValidationError } from 'jsonschema';

export function formatValidatorErrors(errors: ValidationError[]) {
    return errors.map((error) => error.message).join(', ');
}

export function capitalize(str: string): string {
    const firstLetter = str[0].toUpperCase();
    const lastLetters = str.slice(0);
    return firstLetter + lastLetters;
}
