'use strict';

const http = require('http');
const router = require('./router.js');
const OptIn = require('../model/opt-in.js');

var storage = {};

router.post('/api/opt', (req, res) => {
  console.log('req.body:\n', req.body);
  if(!req.body.content){
    res.writeHead(400, {
      'Content-Type': 'text/plain',
    });
    res.write('There was no content in the request.');
    res.end();
    return;
  }
  let optIn = new OptIn(req.body.name, req.body.age);
  storage[optIn.id] = optIn;
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(optIn));
  res.end();
});

router.put('/api/opt', (req, res) => {
  if(!req.url.query.id){
    res.writeHead(400, {
      'Content-Type': 'text/plain',
    });
    res.write('No id provided.');
    res.end();
    return ;
  }
  if(!storage[req.url.query.id]){
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });
    res.write('id not found.');
    res.end();
    return ;
  }
  if(req.url.query.name) storage[req.url.query.id].name = req.url.query.name;
  if(req.url.query.age) storage[req.url.query.id].age = req.url.query.age;
});

router.get('/api/opt', (req, res) => {
  if(!req.url.query.id){
    res.writeHead(400);
    res.end();
    return ;
  }
  if(!storage[req.url.query.id]){
    res.writeHead(404);
    res.end();
    return ;
  }
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.write(JSON.stringify(storage[req.url.query.id]));
  res.end();
});

router.delete('/api/opt', (req, res) => {
  if(!req.url.query.id) {
    res.writeHead(400, {
      'Content-Type': 'text/plain',
    });
    res.write('Bad request: No id provided.');
    res.end();
    return;
  }
  if(!storage[req.url.query.id]) {
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });
    res.write('id not found.');
    res.end();
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'text/plain',
  });
  res.write('User removed.');
  res.end();
  return;
});

module.exports = http.createServer(router.route);
