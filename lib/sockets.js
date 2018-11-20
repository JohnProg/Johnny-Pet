// sockets.js
var socketio = require('socket.io');



module.exports.listen = function(app, db){
    io = socketio.listen(app);

    io.sockets.on('connection', function (socket) {
        require('../lib/johnny').actions(socket);
        // console.log('prueba');
        // console.log(db);
        // var Users = db.collection('users').find().toArray(function (err, items) {
        //     res.json(items);
        // });

		socket.emit('notification', {} );
		

        socket.on('my other event', function (data) {

            users = db.get('users');
            users.insert({ name: 'Tobi', bigdata: {} });

            console.log(data);
        });
    });

    return io;
};