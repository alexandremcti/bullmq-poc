import IORedis from 'ioredis'

const connection = new  IORedis()

export const redisConnection = () => {
    return connection
}