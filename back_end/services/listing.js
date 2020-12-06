// Listing services to run on port 6000
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieparser = require("cookie-parser")

const app = express();
const port = 6000;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());

const url = 'mongodb://localhost:27017';
const databaseName = 'csc667_final';
const usersCollectionName = 'users';
const listingsCollectionName = 'listings';

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

    /*
    /api/listing/create
    POST
    required: itemName, type, picture, description, price
    */
    app.post("/api/listing/create", (req, res) => {
        if (!req.body.itemName || !req.body.type ||
            !req.body.description || !req.body.price) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/create',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        if (!req.cookies['accountId']) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/create',
                data: {
                    reason: 'User must be logged in',
                },
            }));
        }
        const matcher = {
            _id: ObjectId(req.cookies['accountId']),
        }

        usersCollection.findOne(matcher)
            .then( async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/create',
                        data: {
                            reason: 'Account does not exist',
                        },
                    }));
                }
                const newListing = {
                    username: result.username,
                    accountId: String(result._id),
                    itemName: req.body.itemName,
                    type: req.body.type,
                    description: req.body.description,
                    price: req.body.price,
                }
                const newListingDb = await listingsCollection.insertOne(newListing);

                if (newListingDb) {
                    return res.send(JSON.stringify({
                        success: true,
                        responseType: '/api/listing/create',
                        data: {
                            listingId: newListingDb.insertedId,
                        },
                    }));
                }
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/listing/create',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /*
    /api/listing/view
    GET
    optional: listingId, type, username, myListings
    */
    app.get("/api/listing/view", (req, res) => {
        matcher = {}
        if (req.query.listingId)
            matcher['_id'] = ObjectId(req.query.listingId);
        if (req.query.type)
            matcher['type'] = req.query.type;
        if (req.query.username)
            matcher['username'] = req.query.username;
        if (req.query.myListings === 'true' || req.query.myListings === 'True') {
            if (!req.cookies['accountId']) {
                return res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/listing/view',
                    data: {
                        reason: 'User must be logged in',
                    },
                }));
            }
            matcher['accountId'] = req.cookies['accountId']
        }

        listingsCollection.find(matcher).toArray()
            .then( async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/view',
                        data: {
                            reason: 'Listing(s) does not exist',
                        },
                    }));
                }
                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/listing/view',
                    data: {
                        listings: result,
                    },
                }));
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/listing/view',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /*
    /api/listing/delete
    POST
    required: listingID
    */
    app.post("/api/listing/delete", (req, res) => {
        if (!req.body.listingId) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/create',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        if (!req.cookies['accountId']) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/create',
                data: {
                    reason: 'User must be logged in',
                },
            }));
        }
        const matcher = {
            _id: ObjectId(req.body.listingId),
        }

        listingsCollection.findOne(matcher)
            .then( async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/delete',
                        data: {
                            reason: 'Listing does not exist',
                        },
                    }));
                }
                if (result.accountId !== req.cookies['accountId']) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/delete',
                        data: {
                            reason: 'You must be the owner of a listing to delete',
                        },
                    }));
                }
                await listingsCollection.findOneAndDelete(matcher);
                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/listing/delete',
                    data: {
                        listingId: req.body.listingId,
                    },
                }));
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/listing/delete',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /*
    /api/listing/edit
    POST
    required: listingID
    optional: itemName, type, description, price
    */
    app.post("/api/listing/edit", (req, res) => {
        if (!req.body.listingId) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/edit',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        if (!req.body.itemName && !req.body.type && !req.body.description && !req.body.price) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/edit',
                data: {
                    reason: 'At least one field must be updated',
                },
            }));
        }
        if (!req.cookies['accountId']) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/listing/edit',
                data: {
                    reason: 'User must be logged in',
                },
            }));
        }
        const matcher = {
            _id: ObjectId(req.body.listingId),
        }

        listingsCollection.findOne(matcher)
            .then( async (result) => {
                if (!result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/edit',
                        data: {
                            reason: 'Listing does not exist',
                        },
                    }));
                }
                if (result.accountId !== req.cookies['accountId']) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/listing/edit',
                        data: {
                            reason: 'You must be the owner of a listing to edit',
                        },
                    }));
                }
                const updater = {$set: {}}
                if (req.body.itemName)
                    updater['$set']['itemName'] = req.body.itemName;
                if (req.body.type)
                    updater['$set']['type'] = req.body.type;
                if (req.body.description)
                    updater['$set']['description'] = req.body.description;
                if (req.body.price)
                    updater['$set']['price'] = req.body.price;
                
                await listingsCollection.updateOne(matcher, updater);
                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/listing/edit',
                    data: {
                        listingId: req.body.listingId,
                    },
                }));
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/listing/edit',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    app.listen(port, () => console.log(`Listing services listening on port ${port}`));
});