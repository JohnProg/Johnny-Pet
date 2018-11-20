var server = 'http://127.0.0.1:3000';
var socket = io.connect(server);

// socket.on('notificacion', function (data) {
//     console.log(data);
    // socket.emit('my other event', { my: 'prueba de BD' });
// });

	// socket.on('notification', function (data) {
	// 	console.log(data)
	// });

$('#apagar').on('click', function() {
    var socket = io.connect(server);
    socket.emit('apagar', { my: 'data' });
});
$('#prender').on('click', function() {
    var socket = io.connect(server);
    socket.emit('prender', { my: 'data' });
});