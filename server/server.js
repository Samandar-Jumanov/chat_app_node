const fs = require('fs');
const http = require('http');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/chat_server')

const cache = {};

function send404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.write('Error 404: Resource not found');
  response.end();
}

function sendFile(response, fileContents, filePath) {
  response.writeHead(200, {
    'Content-Type': mime.getType(path.basename(filePath))
  });
  response.end(fileContents);
}

function serverStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, cache[absPath], absPath);
  } else {
    fs.stat(absPath, function (err, stats) {
      if (!err && stats.isFile()) {
        fs.readFile(absPath, function (error, data) {
          if (error) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, data, absPath);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

const server = http.createServer((request, response) => {
  let filePath = false;
  if (request.url === '/') {
    filePath = 'C:/Users/samandarjumanov/Desktop/chat_app/client/public/index.html';
  } else {
    filePath = path.join('client/public', request.url);
  }
  const absPath = path.resolve(__dirname, filePath);
  serverStatic(response, cache, absPath);
});

chatServer.listen(server)
server.listen(3001, () => {
  console.log('Server is working');
});
