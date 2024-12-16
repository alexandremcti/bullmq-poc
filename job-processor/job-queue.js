import { Queue } from 'bullmq'
import {redisConnection} from './redis-connection.js'

const jobQueue = new Queue('my-job', {connection: redisConnection})

export const addJob = async (params) => {
    await jobQueue.add('myJob', params)
}
