import Queue from 'bull';
import redisConfig from '../config/redis.js';

const emailQueue = new Queue('emails', {
    redis: redisConfig,
    defaultJobOptions: {
        attempts: 3, // Retry handling
        backoff: {
            type: 'exponential',
            delay: 1000, // 1s, 2s, 4s
        },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for inspection
    }
});

export default emailQueue;
