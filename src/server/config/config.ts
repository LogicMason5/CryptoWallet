import 'dotenv/config';

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function optional(name: string, defaultValue?: string): string | undefined {
    return process.env[name] ?? defaultValue;
}

function parseNumber(name: string, defaultValue?: number): number {
    const value = process.env[name];
    if (!value) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing required numeric env variable: ${name}`);
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
        throw new Error(`Invalid number for env variable: ${name}`);
    }

    return parsed;
}

function parseBoolean(name: string, defaultValue?: boolean): boolean {
    const value = process.env[name];
    if (!value) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing required boolean env variable: ${name}`);
    }

    return value === 'true';
}

function parseJSON<T>(name: string, defaultValue?: T): T {
    const value = process.env[name];
    if (!value) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Missing required JSON env variable: ${name}`);
    }

    try {
        return JSON.parse(value);
    } catch {
        throw new Error(`Invalid JSON format for env variable: ${name}`);
    }
}

const config = {
    app: {
        name: required('APP_NAME'),
        url: required('BASE_URL'),
        dbLink: required('DBLINK'),
        redisLink: required('REDIS_LINK'),
    },

    server: {
        port: parseNumber('SERVER_PORT', 3000),
        host: optional('SERVER_HOST', '0.0.0.0'),
        prefix: optional('SERVER_PREFIX', '/api'),
    },

    cors: {
        origins: parseJSON<string[]>('CORS_ORIGINS', []),
        methods: parseJSON<string[]>('CORS_METHODS', ['GET', 'POST']),
        headers: parseJSON<string[]>('CORS_HEADERS', []),
        maxAge: parseNumber('CORS_MAX_AGE', 86400),
        allowCredentials: parseBoolean('CORS_ALLOW_CREDENTIALS', true),
        exposeHeaders: parseJSON<string[]>('CORS_EXPOSE_HEADERS', []),
    },

    jwt: {
        access: {
            secret: required('JWT_ACCESS_SECRET'),
            lifetime: parseNumber('JWT_ACCESS_LIFETIME'),
        },
        refresh: {
            secret: required('JWT_REFRESH_SECRET'),
            lifetime: parseNumber('JWT_REFRESH_LIFETIME'),
        },
    },
} as const;

export default config;
