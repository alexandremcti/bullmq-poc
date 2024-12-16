import { Worker } from 'bullmq'
import {redisConnection} from './redis-connection.js'

const processEvent = async (event) => {
    console.log(`processando o evento ${JSON.stringify(event)}`)
    event.data.processed = true
    await fetch(
        'http://localhost:3000/events/notify',
        {
            method: 'POST',
            body: JSON.stringify(event.data),
            headers: {
                'Content-type': 'application/json'
            }
        }
    )
}

const worker = new Worker(
    'my-job',
    processEvent,
    {connection: redisConnection}
)

worker.on('completed', (job) => console.log(`evento ${JSON.stringify(job)} foi processado`))
worker.on('failed', (job) => console.log(`falha ao processar o evento ${job.id}. Motivo: ${job.failedReason}`))