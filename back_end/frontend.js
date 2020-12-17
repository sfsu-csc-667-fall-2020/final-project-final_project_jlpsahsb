const express = require('express');
const path = require('path');
const app = express();

// express is not good for production static files, use cdn, or dedicated file server like ngnix, appache
app.use(express.static(path.join(__dirname, '../front_end', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front_end', 'build', 'index.html'));
});

const port = 3001;

app.listen(port);

console.log(`Frontend Build \"Server\" on port ${port}`);