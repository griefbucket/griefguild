var
	net = require('net')
	, bin = require('Binary')
	, sys = require('sys')
	, remote = ['anarchy.gleany.com', 25565]
	, remoteSock = null
	;


net.createServer(function(s) {
	if (remoteSock) {
		sys.debug('Already connected');
		return s.destroy();
	}

	sys.debug('Connecting to remote');

	remoteSock = net.createConnection(remote[1], remote[0]);

	s.on('data', function(d) {
		sys.debug('Sending ' + d.length + ' bytes to remote');
		remoteSock.write(d);
	});

	s.on('end', function() {
		sys.debug('Ending connection to remote');
		remoteSock.end();
		remoteSock = null;
	});

	remoteSock.on('data', function(d) {
		sys.debug('Sending ' + d.length + ' bytes to local');
		s.write(d);
	});

	remoteSock.on('end', function() {
		sys.debug('Ending connection to local');
		s.end();
		remoteSock = null;
	});

}).listen(6000);

sys.debug('Listening on 6000');
