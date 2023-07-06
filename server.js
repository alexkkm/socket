// import http and fs modules
var http = require('http'),
    fs = require('fs'),
    //* NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Create a http server and send index.html to all requests
var app = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io')(app);

// bind the server and listen to 3000 port, and give a notice on console log
app.listen(3000, () => {
    console.log('Server listening on port 3000')
});


// When the user connects the server, perform this:
io.on('connection', function (socket) {
    // Emit a message with title: 'welcome', sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    // Listen on the message from client with the title: "joinned"
    socket.on('joinned', console.log);
});

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 1000);

