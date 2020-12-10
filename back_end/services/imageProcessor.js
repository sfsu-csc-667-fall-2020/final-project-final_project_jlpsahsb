// Image processor (Kafka) running on port 9092
const kafkaConsumer = require('../kafka/KafkaConsumer.js');
const resizeImg = require('resize-img');
const fs = require('fs');
const path = require('path');
const redis = require('redis');
const { MongoClient, ObjectId } = require('mongodb');

const redisClient = redis.createClient({ host: '18.191.127.85' });
const consumer = new kafkaConsumer(['listing']);

const url = 'mongodb://18.191.127.85:27017'
const databaseName = 'csc667_final';
const listingsCollectionName = 'listings';

const client = new MongoClient(url);

client.connect(async (error) => {
    console.log("Image processor service running on port 9092");
    if (error) {
        console.log(error);
        process.exit(1);
    }

    const db = client.db(databaseName);
    const listingsCollection = db.collection(listingsCollectionName);

    consumer.on('message', async (message) => {
        console.log('Message recieved on kafka');

        const listingInfo = JSON.parse(message.value);

        const filepath = path.resolve(('../listingImages/saved/').concat(listingInfo.filename));
        (async () => {
            const image100 = await resizeImg(fs.readFileSync(filepath), {
                width: 100,
                height: 100
            });
            const image500 = await resizeImg(fs.readFileSync(filepath), {
                width: 500,
                height: 500
            });
            fs.writeFileSync(path.resolve(('../listingImages/processed/100/').concat(listingInfo.filename)), image100);
            fs.writeFileSync(path.resolve(('../listingImages/processed/500/').concat(listingInfo.filename)), image500);
        })();

        const matcher = {
            _id: ObjectId(listingInfo.listingId),
        }

        const updater = { $set: {} };
        updater['$set']['status'] = 'done';

        await listingsCollection.updateOne(matcher, updater);

        redisClient.publish("services", JSON.stringify({
            type: '/listing/edit',
            listingId: listingInfo.listingId,
        }));
        console.log('Processed image for listing:', listingInfo.listingId)
    });
})

consumer.connect();