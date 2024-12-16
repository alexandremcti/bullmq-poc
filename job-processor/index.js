import express, { json } from 'express'
import {addJob} from './job-queue.js'
import './job-worker.js'


const server = express();
server.use(json());


server.get('/healthcheck', async (request, response) => {
    response.json({message: 'ok'})
})

server.post('/events', async (request, response) => {
    const data = request.body
    await addJob(data)
    response.status(201).json({message: "created"})
})


server.listen(3001, () => {
    console.log('servidor up!')
})