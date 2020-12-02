// WebSocket service to run on port 3001
const WebSocket = require('ws');

// Web socket server
const webSocketServer = new WebSocket.Server({port: 3001});

// Helper function to broadcast data to all ws clients
const broadcast = (data) => {
    const textToSend = JSON.stringify(data);
    webSocketServer.clients.forEach(client => client.send(textToSend));
};

webSocketServer.on('connection', (ws) => {
    // ws represents a connection
    console.log('Client has connected to websocket server!');

    ws.on('close', () => {
        console.log('Client has disconnected from websocket server!');
    });

    ws.on('message', (rawData) => {
        const data = JSON.parse(rawData);
        console.log('Client sends message to websocket: ' + rawData);

        switch(data.actionType) {
            case 'createInquiry':
                const broadcastMessage = {
                    actionType: 'newInquiryCreated',
                    inquiryID: data.inquiryID,
                };
                broadcast(broadcastMessage);
                break;
            case 'createListing':
                const broadcastMessage = {
                    actionType: 'newListingCreated',
                    listingID: data.listingID,
                };
                broadcast(broadcastMessage);
                break;
            default:
                console.log('Unknown action ' + data.actionType);
        }
    });
});