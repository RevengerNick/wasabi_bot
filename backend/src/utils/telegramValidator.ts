import crypto from 'crypto';

export function validateTelegramData(initDataString: string, botToken: string): { isValid: boolean, user?: any } {
    const params = new URLSearchParams(initDataString);
    const hash = params.get('hash');
    if (!hash) return { isValid: false };
    const user = JSON.parse(params.get('user') || '{}');
    params.delete('hash');
    params.sort();
    const dataCheckString = Array.from(params.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    try {
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
        const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
        if (hmac === hash) {
            return { isValid: true, user };
        }
        return { isValid: false };
    } catch (error) {
        console.error('Ошибка при валидации хеша:', error);
        return { isValid: false };
    }
}