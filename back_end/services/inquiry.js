// Inquiry services to run on port 5000
const express = require('express');

const app = express();
const port= 5000;

/*
/api/inquiry/create
POST
required: listingID, subject, message
*/
app.post("/api/inquiry/create", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});

/*
/api/inquiry/view
GET
required: inquiryID
*/
app.get("/api/inquiry/view", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/inquiry/delete
DELETE
required: inquiryID
*/
app.delete("/api/inquiry/delete", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


/*
/api/inquiry/edit
PUT
required: inquiryID
optional: subject, message
*/
app.put("/api/inquiry/edit", (req, res) => {
    return res.send("TODO: IMPLEMENT!");
});


app.listen(port, () => console.log(`Inquiry services listening on port ${port}`));