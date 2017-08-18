/**
 * Created by MD.ImdadulHuq on 18-Aug-17.
 */

var io = require('socket.io')();
var push_notification = require('./push-notification');

function Sockets(server) {

    this.clients=[];
    var io = require('socket.io').listen(server);

    io.on('connection', function(client){
        console.log('a user connected');
        push_notification.addClient(client);
        client.on('disconnect', function(){
            console.log('user disconnected');
            push_notification.removeClient(client);
        });
    });
}

module.exports = function (server) {
    return new Sockets(server)
};