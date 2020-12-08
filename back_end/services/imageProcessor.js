/*
TODO:
1. Subscribe to kafkfa channel, and listen for messages
2. When a message comes in, it will have the name of image that needs to be processed
3. Pull image and process a 100x100 and 500x500, saving those as well to the correct folder
4. Set listing status to done in mongoDB
5. Announce to redis channel that a new listing has been made
6. Mark kafka message as processed
7. Listen/process for next message
*/

// Image processor (Kafka) running on port 9092
const kafkaConsumer = require('../kafka/KafkaConsumer.js');

const consumer = new kafkaConsumer(['listing']);

consumer.connect('message', (message) => {
    console.log('Message recieved on kafka');
    setTimeout(() => {
        console.log('Image processed');
    }, 3000);
});

consumer.connect();