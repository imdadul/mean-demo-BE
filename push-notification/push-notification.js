/**
 * Created by MD.ImdadulHuq on 18-Aug-17.
 */

function PushNotification() {
    this.clients = []
}

PushNotification.prototype.addClient = function(client) {
    this.clients.push(client);
};
PushNotification.prototype.removeClient = function(client) {
    for(var i=0;i<this.clients.length;i++){
        if(this.clients[i].id == client.id){
            this.clients.splice(i,1);
            break;
        }
    }

};
PushNotification.prototype.notifyAllUsers = function(user,event,movie) {
    this.clients.forEach(function (c) {
        c.emit(event,{movie:movie,email:user.email})
    })
};

module.exports = new PushNotification();