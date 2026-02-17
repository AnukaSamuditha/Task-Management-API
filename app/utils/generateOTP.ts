import crypto from 'crypto';

export const generateVerificationCode = () => {
    return crypto.randomInt(1000,10000)
}