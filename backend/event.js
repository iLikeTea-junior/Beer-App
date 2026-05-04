let clients = []; // a list of clients (same browser open)

export function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')

    res.flushHeaders()
    res.write('data: connected\n\n')

    clients.push(res)

    req.on('close', () => {
        // when a client closes a tab, it removes is from the list (stream of connections)
        clients = clients.filter(client => client !== res)
    })
}

export function sendEvent(eventName, data) {
    clients.forEach(client => {
        // the sendEvent function when used will trigger the event listener, passing it the data, to then be used to update the UI.
        client.write(`event: ${eventName}\n`)
        client.write(`data: ${JSON.stringify(data)}\n\n`)
    })
}
