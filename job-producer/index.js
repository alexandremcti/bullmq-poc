import express, { json } from 'express'
import {setInterval} from 'timers/promises'


const server = express();
server.use(json());

const eventsList = new Map()
let eventIndex = 0;

function findById(id) {
    console.log(`buscando o evento ${id}`)
    const searchedEvent = eventsList.get(id)
    console.log(`evento encontrado ${searchedEvent}`)
    if(searchedEvent && searchedEvent.processed === true){
        console.log('evento encontrado')
        return searchedEvent
    }
    return undefined
} 

server.get('/events/:id', async (request, response) => {
    const {id} = request.params
    let event;
    const ac = new AbortController()
    const retryLimit = 10;
    let retry = 0
    for (const searchedEvent of setInterval(1000, findById(id), {signal: ac.signal})){
        console.log(searchedEvent)
        if (searchedEvent) {
            event = searchedEvent;
            break
        }
        if(retry++ === retryLimit) {
            ac.abort()
            break
        }
    }
    if(!event) response.status(201)
    response.json(event)
})

server.get('/events', async (request, response) => {
    response.json([...eventsList])
})


server.post('/events/notify', async (request, response) => {
    const data = request.body
    eventsList.set(data.id, data)
    response.json({message: 'ok'})
})

server.post('/events', async (request, response) => {
    const data = request.body
    const event = {...data, id: eventIndex, processed: false}
    eventsList.set(eventIndex, event)
    eventIndex++
    await fetch(
        'http://localhost:3001/events',
        {
        method: 'POST',
        body: JSON.stringify(event),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    response.status(201).json({message: "created"})
})


server.listen(3000, () => {
    console.log('servidor up!')
})