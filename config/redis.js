let redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
};

if (process.env.REDIS_URL) {
    const parsed = new URL(process.env.REDIS_URL);
    redisConfig = {
        host: parsed.hostname,
        port: parsed.port,
        password: parsed.password || undefined,
    };
    
    // Handle TLS for rediss:// URLs (common on Render)
    if (parsed.protocol === 'rediss:') {
        redisConfig.tls = { rejectUnauthorized: false };
    }
}

export default redisConfig;
