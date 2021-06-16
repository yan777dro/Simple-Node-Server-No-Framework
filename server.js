var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {  // our server object listens at port 3000!
console.log('request ', request.url);

var filePath = '.' + request.url; //fix URL request if it does not specify a file
if (filePath == './') //example URL hamsters.org will be interpreted as hamsters.org/index.html
    filePath = './index.html';

var extname = String(path.extname(filePath)).toLowerCase();
var contentType = 'text/html';
var mimeTypes = {           
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4'
};     // if the file requested does not match our mimeTypes, we use application/octect-stream as default

contentType = mimeTypes[extname] || 'application/octect-stream';

fs.readFile(filePath, function(error, content) {
    if (error) {                        
        if(error.code == 'ENOENT'){   //if we get a ENOENT/NO ENTRY error, we'll reply with  404 error
            fs.readFile('./404.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            });
        }
        else {
            response.writeHead(500);
            response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            response.end();
        }
    }
    else {
        response.writeHead(200, { 'Content-Type': contentType });      //if there is no error, we'll send the requested file
        response.end(content, 'utf-8');
    }
 });

}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
