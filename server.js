var app = require('./app');
var debug = require('debug')('expressg:server');
var http = require('http');

/*** port environmentin Express.*/
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/*** HTTP server.*/
var server = http.createServer(app);

//get cards model 
var Cards = require('./models/cards');

//get socket io
var io = require('socket.io').listen(server);
//io connect
io.on('connection', function(socket) {

    console.log('A user is connected now');
    Cards.find({}).sort({ date: 'desc'}).lean().exec(function(err, docs) {

        if (!err) {
            socket.emit('cardmessage', docs)
            //process.exit();
        } else {
            throw err;
        }
    });

    socket.on('cardmessage', function(msg) {console.log(msg)
    var c = {
        title: msg.title, 
        content: msg.content,
        slug: msg.slug
    }
	//var to call model
    var card = new Cards(c);
        //save model to MongoDB
        card.save(function(err) {
            if (err) {
                return err;
            } else {
                io.emit('cardmessage', c);
                console.log("Card saved");
            }
        });
    });
});

/*** Listen on provided port, on all network interfaces.*/

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/*** Normalize a port into a number, string, or false.*/

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/*** Event listener for server "error" event.*/

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
        case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
        default:
        throw error;
    }
}

/*** Event listener for HTTP server "listening" event.*/

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
