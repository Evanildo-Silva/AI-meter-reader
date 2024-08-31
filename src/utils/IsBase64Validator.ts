import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBase64', async: false })
@Injectable()
export class IsBase64Validator implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
        if (typeof text !== 'string') return false;

        const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
        return base64Regex.test(text);
    }

    defaultMessage(args: ValidationArguments) {
        return 'The image must be a valid Base64 string';
    }
}
