import { Prisma } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';

const MAX_NAME_LENGTH = 100;
const MAX_USERNAME_LENGTH = 50;

const RESERVED_USERNAMES = new Set(['admin', 'administrator', 'root', 'support', 'system']);

type IdentityInput = {
    firstName: unknown;
    lastName: unknown;
    username?: unknown;
};

function invalidInput(field: string, message: string): never {
    throw new BadRequestException({
        code: 'INVALID_INPUT',
        field,
        message
    });
}

export function normalizeAndValidateName(value: unknown, field: 'firstName' | 'lastName'): string {
    if (typeof value !== 'string') {
        invalidInput(field, `${field} must be a string.`);
    }

    // Reject control/invisible formatting characters before trimming.
    if (/\p{C}/u.test(value)) {
        invalidInput(field, `${field} contains unsupported control or formatting characters.`);
    }

    const name = value
        .normalize('NFC')
        .replace(/\p{Zs}+/gu, ' ')
        .trim();

    if ([...name].length < 1 || [...name].length > MAX_NAME_LENGTH) {
        invalidInput(field, `${field} must contain between 1 and ${MAX_NAME_LENGTH} characters.`);
    }

    // Require at least one letter and allow common name punctuation.
    const containsLetter = /\p{L}/u.test(name);
    const containsAllowedCharacters = /^[\p{L}\p{M} .'’ʼ‐‑-]+$/u.test(name);

    if (!containsLetter || !containsAllowedCharacters) {
        invalidInput(field, `${field} may contain letters, accents, spaces, apostrophes, hyphens and periods.`);
    }

    return name;
}

export function normalizeAndValidateUsername(value: unknown): string {
    if (typeof value !== 'string') {
        invalidInput('username', 'Username must be a string.');
    }

    if (/\p{C}/u.test(value)) {
        invalidInput('username', 'Username contains unsupported control or formatting characters.');
    }

    const username = value.trim().normalize('NFC').toLowerCase().normalize('NFC');

    const validPattern = /^\p{L}[\p{L}\p{M}0-9]*(?:[._-][\p{L}0-9][\p{L}\p{M}0-9]*)*$/u;

    if ([...username].length < 3 || [...username].length > MAX_USERNAME_LENGTH) {
        invalidInput('username', `Choose a username between 3 and ${MAX_USERNAME_LENGTH} characters.`);
    }

    if (!validPattern.test(username)) {
        invalidInput(
            'username',
            'Start with a letter. Use letters, accents, digits, dots, underscores or hyphens; no spaces, repeated separators or trailing separators.'
        );
    }

    if (RESERVED_USERNAMES.has(username)) {
        invalidInput('username', 'This username is reserved. Please choose another.');
    }

    return username;
}

export function generateUsernameFromNames(firstName: unknown, lastName: unknown): string {
    const first = normalizeAndValidateName(firstName, 'firstName');
    const last = normalizeAndValidateName(lastName, 'lastName');

    // Remove spaces and name punctuation from each username component.
    const toPart = (name: string) => name.replace(/[ .'’ʼ‐‑-]/gu, '');

    return normalizeAndValidateUsername(`${toPart(first)}.${toPart(last)}`);
}

function usernameTaken(): never {
    throw new ConflictException({
        code: 'USERNAME_TAKEN',
        field: 'username',
        message: 'This username is already taken. Please choose an alternative username.'
    });
}

export async function prepareUserIdentity(
    input: IdentityInput,
    isUsernameTaken: (username: string) => Promise<boolean>
): Promise<{
    firstName: string;
    lastName: string;
    username: string;
}> {
    // Validate names even when the user supplies their own username.
    const firstName = normalizeAndValidateName(input.firstName, 'firstName');

    const lastName = normalizeAndValidateName(input.lastName, 'lastName');

    const username =
        input.username === undefined
            ? generateUsernameFromNames(firstName, lastName)
            : normalizeAndValidateUsername(input.username);

    if (await isUsernameTaken(username)) {
        usernameTaken();
    }

    return { firstName, lastName, username };
}

// An availability check cannot reserve a username.
// Handle uniqueness conflicts during database creation as well.
export function rethrowUserCreationError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target;
        const fields = Array.isArray(target) ? target : [];

        if (fields.includes('username')) {
            usernameTaken();
        }

        if (fields.includes('email')) {
            throw new ConflictException({
                code: 'EMAIL_TAKEN',
                field: 'email',
                message: 'An account with this email already exists.'
            });
        }
    }

    // Do not disguise unrelated database failures as username conflicts.
    throw error;
}
