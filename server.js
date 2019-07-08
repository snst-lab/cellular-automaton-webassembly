'use strict';
const express = require('express');
const root =  require("app-root-path");
express.static.mime.types['wasm'] = 'application/wasm'

/**
 * Server Configuration
 */
const app = new express();
app.use(express.static("."));
app.get("/", (req, res) => {
    res.sendFile(root + '/index.html');
});
app.post('/api',  (req, res) => {
    res.send('POST request received.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));