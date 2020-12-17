// Inquiry services to run on port 5000
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieparser = require("cookie-parser")
const redis = require('redis');

const redisClient = redis.createClient({host:'redis'});
const app = express();
const port = 5000;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());

const url = 'mongodb://mongo:27017'
const databaseName = 'csc667_final';
const usersCollectionName = 'users';
const listingsCollectionName = 'listings';
const inquiriesCollectionName = 'inquiries';

const client = new MongoClient(url);

client.connect((error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log('Connected to', databaseName);

    const db = client.db(databaseName);
    const usersCollection = db.collection(usersCollectionName)
    const listingsCollection = db.collection(listingsCollectionName);
    const inquiriesCollection = db.collection(inquiriesCollectionName);

    /*
    /api/inquiry/create
    POST
    required: listingId, subject, message
    */
    app.post("/api/inquiry/create", (req, res) => {
        if (!req.body.listingId || !req.body.subject || !req.body.message) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/inquiry/create',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        if (!req.cookies['accountId']) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/inquiry/create',
                data: {
                    reason: 'User must be logged in',
                },
            }));
        }
        const listingMatcher = {
            _id: ObjectId(req.body.listingId),
        }

        listingsCollection.findOne(listingMatcher)
            .then(async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/inquiry/create',
                        data: {
                            reason: 'Listing does not exist',
                        },
                    }));
                }
                if (result.accountId === req.cookies['accountId']) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/inquiry/create',
                        data: {
                            reason: 'Can not send inquiry to your own listing',
                        },
                    }));
                }

                const newInquiry = {
                    usernameOwner: result.username,
                    accountIdOwner: result.accountId,
                    usernameInterested: req.cookies['username'],
                    accountIdInterested: req.cookies['accountId'],
                    listingId: String(result._id),
                    subject: req.body.subject,
                    messages: [
                        {
                            sentBy: req.cookies['username'],
                            message: req.body.message
                        }
                    ],
                }
                const newInquiryDb = await inquiriesCollection.insertOne(newInquiry);
                redisClient.publish("services", JSON.stringify({
                    type: '/inquiry/create',
                    inquiryId: newInquiryDb.insertedId,
                    accountIdOwner: newInquiry.accountIdOwner,
                    accountIdInterested: newInquiry.accountIdInterested,
                }));
                if (newInquiryDb) {
                    return res.send(JSON.stringify({
                        success: true,
                        responseType: '/api/inquiry/create',
                        data: {
                            inquiryId: newInquiryDb.insertedId,
                        },
                    }));
                }
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/inquiry/create',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /*
    /api/inquiry/view
    GET
    required: inquiryId, myInquiries
    */
    app.get("/api/inquiry/view", (req, res) => {
        if (!req.query.inquiryId && !req.query.myInquiries) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/inquiry/view',
                data: {
                    reason: 'Restricted Access, private inquiries!!!!!!',
                },
            }));
        }

        const matcher = {};
        if (req.query.inquiryId)
            matcher['_id'] = ObjectId(req.query.inquiryId);

        if (req.query.myInquiries === 'true' || req.query.myInquiries === 'True') {
            if (!req.cookies['accountId']) {
                return res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/inquiry/view',
                    data: {
                        reason: 'User must be logged in',
                    },
                }));
            }
        }

        inquiriesCollection.find(matcher).toArray()
            .then(async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/inquiry/view',
                        data: {
                            reason: 'Inquiry(s) does not exist',
                        },
                    }));
                }
                if (req.query.myInquiries === 'true' || req.query.myInquiries === 'True') {
                    result = result.filter((inquiry) => {
                        if (inquiry.accountIdOwner === req.cookies['accountId'] || inquiry.accountIdInterested === req.cookies['accountId']) {
                            return inquiry;
                        }
                    })
                }

                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/inquiry/view',
                    data: {
                        inquiries: result,
                    },
                }));
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/inquiry/view',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /*
    /api/inquiry/reply
    POST
    required: inquiryId, message
    */
    app.post("/api/inquiry/reply", (req, res) => {
        if (!req.body.inquiryId || !req.body.message) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/inquiry/reply',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        if (!req.cookies['accountId']) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/inquiry/reply',
                data: {
                    reason: 'User must be logged in',
                },
            }));
        }
        const matcher = {
            _id: ObjectId(req.body.inquiryId),
        }

        inquiriesCollection.findOne(matcher)
            .then(async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/inquiry/reply',
                        data: {
                            reason: 'Inquiry does not exist',
                        },
                    }));
                }
                if (result.accountIdOwner !== req.cookies['accountId'] &&
                    result.accountIdInterested !== req.cookies['accountId']) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/inquiry/reply',
                        data: {
                            reason: 'You must be a part of this inquiry to reply',
                        },
                    }));
                }

                newMessage = {
                    sentBy: req.cookies['username'],
                    message: req.body.message
                };

                await inquiriesCollection.updateOne(matcher, {$push: {messages: newMessage}});
                redisClient.publish("services", JSON.stringify({
                    type: '/inquiry/reply',
                    inquiryId: req.body.inquiryId,
                    accountIdOwner: result.accountIdOwner,
                    accountIdInterested: result.accountIdInterested,
                }));
                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/inquiry/reply',
                    data: {
                        inquiryId: String(result._id),
                    },
                }));
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/inquiry/reply',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    app.listen(port, () => console.log(`Inquiry services listening on port ${port}`));
});
