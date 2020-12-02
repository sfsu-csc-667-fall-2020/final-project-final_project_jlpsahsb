// Gateway service to run on port 3000
const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;

const apiProxy = httpProxy.createProxyServer();

// Have to do this so entire app doesnt crash on error
apiProxy.on('error', (err, req, res) => {
    console.log(err);
    res.status(500).send('Proxy Error')
});


// Proxy for auth services
// Auth services to run on port 4000
app.all('/api/auth*', (req, res) => {
    console.log(req.path);
    const options = {
        target: 'http://localhost:4000'
    };
    apiProxy.web(req,res, options);
});

// Proxy for inquiry services
// Inquiry services to run on port 5000
app.all('/api/inquiry*', (req, res) => {
    console.log(req.path);
    const options = {
        target: 'http://localhost:5000'
    };
    apiProxy.web(req,res, options);
});

// Proxy for listing services
// Listing services to run on port 6000
app.all('/api/listing*', (req, res) => {
    console.log(req.path);
    const options = {
        target: 'http://localhost:6000'
    };
    apiProxy.web(req,res, options);
});

// Start gateway server
app.listen(port, () => console.log(`Proxy listening on port ${port}`));