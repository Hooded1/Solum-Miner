const express = require('express');
const app = express();
var bodyParser = require('body-parser');

var path = require('path');
var fs = require('fs');
const uuid = require('uuidv4');

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'js', 'css'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});

app.use('/game', express.static('game', options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var sys = {
  protocol: 'http',
  host: process.env.NODE_IP || '127.0.0.1',
  port: process.env.NODE_PORT || '3000'
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/game/index.html'));
});

app.listen(sys.port, () => {
  console.log(`Game started on ${sys.host}:${sys.port}`);
});