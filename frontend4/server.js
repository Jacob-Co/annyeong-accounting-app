// const express = require('express');
// const serveStatic = require("serve-static")
// const path = require('path');
// app = express();
// app.use(serveStatic(path.join(__dirname, 'dist')));
// const port = process.env.PORT || 3000;
// app.listen(port);


// import express from 'express';
// import serveStatic from 'serve-static';

const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const app = express();
console.log("Server.js is running", path.join(__dirname, 'dist'))
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 3001;
app.listen(port);