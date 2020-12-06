// Websocket service to run on port 4001
const WebSocket = require('ws');
const redis = require('redis');

const webSocketServer = new WebSocket.Server({ port: 4001 });
const redisClient = redis.createClient({ host: '18.191.127.85' });

webSocketServer.on('connection', (webSocketClient) => {
    //When a client connects, it will send a message with the form `{accountId: accountId, username: username}`. 
    console.log('Someone has connected to the websocket server!');
    webSocketClient.on('message', (message) => {
        webSocketClient['accountId'] = JSON.parse(message)['accountId']
        webSocketClient['username'] = JSON.parse(message)['username']
    })
});

// Helper function to broadcast message to all clients
const broadcast = (message) => {
    webSocketServer.clients.forEach(client => client.send(message));
};

redisClient.on('message', (channel, message) => {
    switch (JSON.parse(message)['type']) {
        case '/listing/create':
        case '/listing/delete':
        case '/listing/edit':
            console.log('/listing: \n\t', message);
            broadcast(message);
            break;
        case '/inquiry/create':
        case '/inquiry/reply':
            console.log('/inquiry: \n\t', message);
            webSocketServer.clients.forEach((webSocketClient) => {
                if (webSocketClient['accountId'] == JSON.parse(message)['accountIdOwner'] ||
                    webSocketClient['accountId'] == JSON.parse(message)['accountIdInterested']) {
                    webSocketClient.send(message);
                }
            });
            break;
        default:
            console.log('Received an unkown message at the channel: ',  channel);
            break;
    }
});

redisClient.subscribe("services");

console.log('Websocket service listening on port 4001')
