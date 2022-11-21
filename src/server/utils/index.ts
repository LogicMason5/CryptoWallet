import { v4 as uuidv4, } from 'uuid';
import { Boom, } from '@hapi/boom';
import { Request, } from '@hapi/hapi';
import { IResponse, } from '../interfaces';
import { ERRORS, } from '../errors/codes';

/**
 * Response function.
 *
 * @remarks
 * Used in server handlers to define our response data.
 *
 * @param res - The response object.
 *
 * @returns IResponse
 */
export function response(res?: object | undefined): IResponse {
    return {
        ok: true,
        result: res,
    };
}

/**
 * Error return function.
 *
 * @remarks
 * Used in server handlers to define our error data.
 *
 * @param code - The https error code.
 * @param msg - The https error message.
 * @param data - The error object
 *
 * @returns Boom
 */
export function error(code: number, msg: string, data: object): Boom {
    return new Boom(msg, {
        data: {
            code,
            data,
            api: true,
        },
        statusCode: Math.floor(code / 1000),
    });
}

/**
 * UUID4 generator.
 *
 * @remarks
 * Generates a random version 4 UUID.
 *
 * @returns string
 */
export function getUUID(): string {
    return uuidv4();
}

/**
 * Current date.
 *
 * @remarks
 * Gets the date in the format Day-Month-Year.
 *
 * @param date - Default date object.
 *
 * @returns string
 */
export function getDate(date: Date = new Date()) {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

/**
 * Delay utility function.
 *
 * @remarks
 * Delays the process according to specified interval.
 *
 * @param ms - The delay time in ms
 *
 * @returns Promise<void>
 */
export const delay = (ms: number) => new Promise((res) => {
    setTimeout(res, ms);
});

/**
 * Handles validation error.
 *
 * @remarks
 * A failAction value which determines how to handle failed validations.
 *
 * @returns Promise<Boom>
 */
export async function handleValidationError(r: any, h: any, err: any): Promise<Boom> {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        const invalidItem = err.details[0];
        return error(ERRORS.BAD_REQUEST, invalidItem.message, invalidItem.details);
    }

    return error(ERRORS.BAD_REQUEST, err, {});
}

/**
 * Gets IP address.
 *
 * @remarks
 * Gets the IP from the header or the remote client.
 *
 * @param headers - The raw request header.
 * @param remoteAddress - Remote client IP.
 *
 * @returns string
 */
export function getIPAddress({ headers, info: { remoteAddress, }, }: Request): string {
    return headers['X-Forwarded-For'] || remoteAddress;
}
