// Auth services to run on port 4000
const express = require('express');

const app = express();
const port= 4000;

/*
/api/account/create
POST
required: username, password, email, firstName, lastName
*/
app.post("/api/account/create", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/* 
/api/account/login
POST
required: username, password
*/
app.post("/api/account/login", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/account/logout
POST
required: *nothing*
*/
app.post("/api/account/logout", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


app.listen(port, () => console.log(`Auth services listening on port ${port}`));