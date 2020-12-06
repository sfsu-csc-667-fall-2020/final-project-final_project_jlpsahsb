// Auth services to run on port 4000
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieparser = require("cookie-parser")

const app = express();
const port = 4000;

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(cors());

const url = 'mongodb://18.191.127.85:27017'
const databaseName = 'csc667_final';
const usersCollectionName = 'users';

const client = new MongoClient(url);

client.connect((error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    console.log('Connected to', databaseName);

    const db = client.db(databaseName);
    const usersCollection = db.collection(usersCollectionName);

    /*
    /api/account/create
    POST
    required: username, password, firstName, lastName
    */
    app.post("/api/account/create", (req, res) => {
        if (!req.body.username || !req.body.password ||
            !req.body.firstName || !req.body.lastName) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/account/create',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        const matcher = {
            username: req.body.username,
        }

        usersCollection.findOne(matcher)
            .then( async (result) => {
                if (result) {
                    return res.send(JSON.stringify({
                        success: false,
                        responseType: '/api/account/create',
                        data: {
                            reason: 'Username is already in use',
                        },
                    }));
                }
                const newUser = {
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                }
                const newUserDb = await usersCollection.insertOne(newUser);

                if (newUserDb) {
                    return res.send(JSON.stringify({
                        success: true,
                        responseType: '/api/account/create',
                        data: {
                            accountId: newUserDb.insertedId,
                        },
                    }));
                }
            })
            .catch((e) => {
                console.log(e);
                res.send(JSON.stringify({
                    success: false,
                    responseType: '/api/account/create',
                    data: {
                        reason: e,
                    },
                }));
            });
    });

    /* 
    /api/account/login
    POST
    required: username, password
    */
    app.post("/api/account/login", (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/account/create',
                data: {
                    reason: 'All required fields must be filled out',
                },
            }));
        }
        const matcher = {
            username: req.body.username,
            password: req.body.password,
        }
        usersCollection.findOne(matcher)
        .then((result) => {
            if (result) {
                res.cookie('accountId', result._id, { maxAge: 86400000 });     // 86400000 ms is 24 hrs
                res.cookie('username', req.body.username, { maxAge: 86400000 });     // 86400000 ms is 24 hrs
                return res.send(JSON.stringify({
                    success: true,
                    responseType: '/api/account/login',
                    data: {
                        accountId: result._id,
                    },
                }));
            }
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/account/login',
                data: {
                    reason: 'Incorrect Username or Password',
                },
            })); 
        })
        .catch((e) => {
            console.log(e);
            res.send(JSON.stringify({
                success: false,
                responseType: '/api/account/login',
                data: {
                    reason: e,
                },
            }));
        });
    });

    /*
    /api/account/logout
    POST
    required: *nothing*
    */
    app.post("/api/account/logout", (req, res) => {
        const accountId = req.cookies['accountId'];
        if(!accountId) {
            return res.send(JSON.stringify({
                success: false,
                responseType: '/api/account/logout',
                data: {
                    reason: 'No user is logged in',
                },
            }));
        }
        res.clearCookie('accountId');
        res.clearCookie('username');
        return res.send(JSON.stringify({
            success: true,
            responseType: '/api/account/logout',
            data: {
                accountId,
            },
        }))
    });

    app.listen(port, () => console.log(`Auth services listening on port ${port}`));
});