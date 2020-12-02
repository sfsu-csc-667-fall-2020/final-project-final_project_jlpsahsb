// Listing services to run on port 6000
const express = require('express');

const app = express();
const port= 6000;

/*
/api/listing/create
POST
required: itemName, type, picture, description, price
*/
app.post("/api/listing/create", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/listing/view
GET
optional: listingID, type
*/
app.get("/api/listing/view", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/listing/delete
DELETE
required: listingID
*/
app.delete("/api/listing/delete", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/listing/edit
PUT
required: listingID
optional: itemName, type, picture, description, price
*/
app.put("/api/listing/edit", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


app.listen(port, () => console.log(`Listing services listening on port ${port}`));