// Import http and file system modules
var http = require('http'),
    fs = require('fs'),
    //* NEVER use a Sync function except at start-up!
    // Use fs module to read the index.html and label it as index
    index = fs.readFileSync(__dirname + '/index.html');

// //OR can perform error handling when reading 'index.html'
/* index = fs.readFileSync(__dirname + '/index.html', 
    function(error,data){
        if (error){
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
        } else{
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data, "utf8");
        }
);
*/

// Create a http server, and
// the function declared that, when the server receive request, then response the following
var httpServer = http.createServer(function (req, res) {
    // set the http response header to be:
    // status code: 200 , content type: html
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // end the response header declaration
    res.end(index);
});

// Socket.io server listens to our httpServer
var io = require('socket.io')(httpServer);

// Bind the server and listen to 3000 port, and give a notice on console log
httpServer.listen(3000, () => {
    console.log('Server listening on port 3000')
});


// When the user connects the server, perform the followings:
io.on('connection', function (socket) {

    // Emit a message with title: 'welcome', sending the data which contains the user's own id
    socket.emit('welcome', { type: "system", message: 'Welcome!', userId: socket.id });

    // Listen on and display when receiving the message from client with the title: "joinned"
    socket.on('joinned', function (data) {
        // Emit a message globally that one client has left
        socket.broadcast.emit('message',
            { type: "system", message: 'One user left!' }
        );
        // Display message: "userID has been joinned"
        console.log(data.userId + " has been joinned")
    });

    // Listen on and display when receiving the message from client with the title: "message"
    socket.on('message', function (data) {
        // Emit a message globally that message
        //! this part not working
        socket.broadcast.emit('update', data);
        // Display message
        console.log(data)
    });

    // when the user disconnects, perform the followings:
    socket.on('disconnect', () => {
        // Emit a message globally that one client has left
        socket.broadcast.emit('message',
            { type: "system", message: 'One user has been left!' }
        );
        // Display message: "one user left"
        console.log('One user has been left!')
    });
})

// Send current time to all connected clients
function sendTime() {
    // Get the current time
    var date = new Date();
    // Reformatting the date into time, Hour:Min:Second
    var timetext = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // Emit the current time to client
    io.emit('time', { type: 'information', time: timetext });
}

// Send current time every 1 secs
setInterval(sendTime, 1000);

