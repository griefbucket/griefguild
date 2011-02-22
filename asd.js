var
	net = require('net')
	, Binary = require('binary')
	, sys = require('sys')
	, remote = ['localhost', 25565]
	, remoteSock = null
	;

function appendBuf(buf1, buf2) {
	if (!buf1 || !buf1.length)
		return buf2;

	if (!buf2 || !buf2.length)
		return buf1;

	var newBuf = new Buffer(buf1.length + buf2.length);
	buf1.copy(newBuf, 0, 0, buf1.length);
	buf2.copy(newBuf, buf1.length, 0, buf2.length);
	return newBuf;
}

function out1(s) {
	sys.debug(s);
}

var serverToClient = 
	{ 0x00 :
		/* Keep alive */
		function(buf, state) {
			out1('keep-alive');
			return -1;
		}

	, 0x01 :
		/* Login request */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('len_unused_1')
				.buffer('unused_1', p.vars.len_unused_1)
				.word16bs('len_unused_2')
				.buffer('unused_2', p.vars.len_unused_2)
				.word64bs('map_seed')
				.word8bs('dimension')
				;

			if (p.vars.dimension === null)
				return -1;

			p.vars.unused_1 = p.vars.unused_1.toString();
			p.vars.unused_2 = p.vars.unused_2.toString();

			out1('login ' + sys.inspect(p.vars));
			return 4 + 2 + p.vars.len_unused_1 + 2 + p.vars.len_unused_2 + 8 + 1;
		}

	, 0x02 :
		/* Handshake */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word16bs('len_hash')
				.buffer('hash', p.vars.len_hash)
				;

			if (p.vars.len_hash === null)
				return -1;
				
			if (p.vars.hash.length != p.vars.len_hash)
				return -1;

			if (p.vars.len_hash != 16) {
				sys.debug('WARNING: Hash length != 16');
			}

			p.vars.hash = p.vars.hash.toString();

			out1('handshake ' + sys.inspect(p.vars));
			return 2 + p.vars.len_hash;
		}

	, 0x03 :
		/* Chat message */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word16bs('len_msg')
				.buffer('msg', p.vars.len_msg)
				;

			if (p.vars.len_msg === null)
				return -1;

			if (p.vars.msg.length != p.vars.len_msg)
				return -1;

			out1('chat ' + sys.inspect(p.vars));
			return 2 + p.vars.len_msg;
		}

	, 0x04 :
		/* Time update */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('time')
				;

			if (p.vars.time === null)
				return -1;

			out1('time ' + sys.inspect(p.vars));
			return 8;
		}

	, 0x05 :
		/* Equipped Entity */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('slot')
				.word16bs('item_id')
				.word16bs('unused')
				;

			if (p.vars.unused === null)
				return -1;

			return 4 + 2 + 2 + 2;
		}

	, 0x06 :
		/* Spawn Position */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				;

			if (p.vars.z === null)
				return -1;

			return 4 + 4 + 4;
		}

	, 0x08 :
		/* Update Health */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word16bs('health')
				;

			if (p.vars.health === null)
				return -1;

			return 2;
		}

	, 0x0D :
		/* Player position and look */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word64bs('x')
				.word64bs('stance')
				.word64bs('y')
				.word64bs('z')
				.word32bs('yaw')
				.word32bs('pitch')
				.word8bs('on_ground')
				;

			if (p.vars.on_ground === null)
				return -1;

			return 8 + 8 + 8 + 8 + 4 + 4 + 1;
		}

	, 0x12 :
		/* Animate entity */
		function(buf, state) {	
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('animation')
				;

			if (p.vars.animation === null)
				return -1;

			return 4 + 1;
		}

	, 0x13 :
		/* Entity action */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('action')
				;

			if (p.vars.action === null)
				return -1;

			return 4 + 1;
		}

	, 0x14 :
		/* Named entity spawn */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('len_name')
				.buffer('name', p.vars.len_name)
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				.word8bs('rotation')
				.word8bs('pitch')
				.word16bs('holding')
				;

			if (p.vars.holding === null)
				return -1;

			return 4 + 2 + p.vars.len_name + 4 + 4 + 4 + 1 + 1 + 2;
		}

	, 0x15 :
		/* Pickup spawn */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('item_id')
				.word8bs('count')
				.word16bs('data')
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				.word8bs('rotation')
				.word8bs('pitch')
				.word8bs('roll')
				;

			if (p.vars.roll === null)
				return -1;

			return 4 + 2 + 1 + 2 + 4 + 4 + 4 + 1 + 1 + 1;
		}

	, 0x16 :
		/* Collect item */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word32bs('collector_id')
				;

			if (p.vars.collector_id === null)
				return -1;

			return 4 + 4;
		}

	, 0x17 :
		/* Object/vehicle spawn */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('type')
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				;

			if (p.vars.z === null)
				return -1;

			return 4 + 1 + 4 + 4 + 4;
		}

	, 0x18 :
		/* Mob spawn */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('type')
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				.word8bs('yaw')
				.word8bs('pitch')
				.scan('metadata', new Buffer([0x7F]))
				;

			/* XXX: This is tricky */
			var md = p.vars.metadata;
			if (md === null || md[md.length - 1] !== 0x7F)
				return -1;

			return 4 + 1 + 4 + 4 + 4 + 1 + 1 + md.length;
		}

	, 0x19 :
		/* Painting */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('len_title')
				.buffer('title', p.vars.len_title)
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				.word32bs('type')
				;

			if (p.vars.type === null)
				return -1;

			return 4 + 2 + p.vars.len_title + 4 + 4 + 4 + 4;
		}

	, 0x1C :
		/* Entity velocity */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word16bs('vel_x')
				.word16bs('vel_y')
				.word16bs('vel_z')
				;

			if (p.vars.vel_z === null)
				return -1;

			return 4 + 2 + 2 + 2;
		}

	, 0x1D :
		/* Destroy entity */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				;

			if (p.vars.entity_id === null)
				return -1;

			return 4;
		}

	, 0x1E :
		/* Entity */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				;

			if (p.vars.entity_id === null)
				return -1;

			return 4;
		}

	, 0x1F :
		/* Entity relative move */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('rel_x')
				.word8bs('rel_y')
				.word8bs('rel_z')
				;

			if (p.vars.rel_z === null)
				return -1;

			return 4 + 1 + 1 + 1;
		}

	, 0x20 :
		/* Entity look */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word1bs('yaw')
				.word1bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			return 4 + 1 + 1;
		}

	, 0x21 :
		/* Entity look and relative move */
		function(buf, state) {
			var p = Binary.parse(buf);
			p	
				.word32bs('entity_id')
				.word1bs('rel_x')
				.word1bs('rel_y')
				.word1bs('rel_z')
				.word1bs('yaw')
				.word1bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			return 4 + 1 + 1 + 1 + 1 + 1;
		}

	, 0x22 :
		/* Entity teleport */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word32bs('x')
				.word32bs('y')
				.word32bs('z')
				.word8bs('yaw')
				.word8bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			return 4 + 4 + 4 + 4 + 1 + 1;
		}

	, 0x26 :
		/* Entity status */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('status')
				;

			if (p.vars.status === null)
				return -1;

			return 4 + 1;
		}

	, 0x28 :
		/* Entity metadata */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.scan('metadata', new Buffer([0x7F]))
				;

			var md = p.vars.metadata;
			if (md === null || md[md.length - 1] !== 0x7F)
				return -1;

			return 4 + md.length;
		}

	, 0x32 :
		/* Pre-chunk */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word32bs('z')
				.word8bs('mode')
				;

			if (p.vars.mode === null)
				return -1;

			return 4 + 4 + 1;
		}

	, 0x33 :
		/* Map chunk */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word16bs('y')
				.word32bs('z')
				.word8bs('size_x')
				.word8bs('size_y')
				.word8bs('size_z')
				.word32bs('len_data')
				.buffer('data', p.vars.len_data)
				;

			if (p.vars.data === null)
				return -1;

			if (p.vars.data.length < p.vars.len_data)
				return -1;

			return 4 + 2 + 4 + 1 + 1 + 1 + 4 + p.vars.len_data;
		}

	, 0x34 :
		/* Multi block change */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word32bs('z')
				.word16bs('len_array')
				.buffer('coord_array', p.vars.len_array * 2)
				.buffer('type_array', p.vars.len_array)
				.buffer('metadata_array', p.vars.len_array)
				;

			if 
				( p.vars.len_array === null
				|| p.vars.metadata_array.length != p.vars.len_array
				)
			{
				return -1;
			}

			return 4 + 4 + 2 + 4 * (p.vars.len_array);
		}

	, 0x35 :
		/* Block change */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word16bs('y')
				.word32bs('z')
				.word8bs('type')
				.word8bs('metadata')
				;

			if (p.vars.metadata === null)
				return -1;

			return 4 + 2 + 4 + 1 + 1;
		}

	, 0x36 :
		/* Play note block */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word16bs('y')
				.word32bs('z')
				.word8bs('type')
				.word8bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			return 4 + 2 + 4 + 1 + 1;
		}
	
	, 0x3C :
		/* Explosion */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word64bs('x')
				.word64bs('y')
				.word64bs('z')
				.word32bs('unused')
				.word32bs('count')
				.buffer('records', p.vars.count * 3)
				;
			
			if
				( p.vars.count === null
				|| p.vars.records === null
				|| p.vars.records.length != p.vars.count * 3
				)
			{
				return -1;
			}

			return 4 + 4 + 4 + 2 + 2 + 3 * p.vars.count;
		}

	, 0x64 :
		/* Open window */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				.word8bs('type')
				.word16bs('len_title')
				.buffer('title', p.vars.len_title)
				.word8bs('num_slots')
				;

			if (p.vars.num_slots === null)
				return -1;

			return 1 + 1 + 2 + p.vars.len_title + 1;
		}

	, 0x65 :
		/* Close window */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				;

			if (p.vars.window_id === null)
				return -1;

			return 1;
		}

	, 0x67 :
		/* Set slot */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				.word16bs('slot')
				.word16bs('item_id')
				.word8bs('item_count')
				.word16bs('item_uses')
				;

			if (p.vars.item_id === null)
				return -1;

			/* NOTE: If itemid == -1, item_count and _uses aren't sent */
			if (p.vars.item_id == -1)
				return 1 + 2 + 2;

			if (p.vars.item_uses === null)
				return -1;

			return 1 + 2 + 2 + 1 + 2;
		}

	, 0x68 :
		/* Window items */
		function(buf, state) {

		}

	, 0x69 :
		/* Update progress bar */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				.word16bs('progress_id')
				.word16bs('value')
				;

			if (p.vars.value === null)
				return -1;

			return 1 + 2 + 2;
		}

	, 0x6A :
		/* Transaction status */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				.word16bs('action_id')
				.word8bs('accepted')
				;

			if (p.vars.accepted === null)
				return -1;

			return 1 + 2 + 1;
		}

	, 0x82 :
		/* Update sign */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word16bs('y')
				.word32bs('z')
				.word16bs('len_first')
				.buffer('first', p.vars.len_first)
				.word16bs('len_second')
				.buffer('second', p.vars.len_second)
				.word16bs('len_third')
				.buffer('third', p.vars.len_third)
				.word16bs('len_fourth')
				.buffer('fourth', p.vars.len_fourth)
				;

			if 
				( p.vars.len_fourth === null
				|| p.vars.fourth.length != p.vars.len_fourth
				)
			{
				return -1;
			}

			return 4 + 2 + 4 
				+ 2 + p.vars.len_first
				+ 2 + p.vars.len_second
				+ 2 + p.vars.len_third
				+ 2 + p.vars.len_fourth
				;
		}

	, 0xFF :
		/* Disconnect */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word16bs('len_reason')
				.buffer('reason', p.vars.len_reason)
				;

			if
				( p.len_reason === null
				|| p.reason.length != p.len_reason
				)
			{
				return -1;
			}

			return 2 * p.vars.len_reason;
		}
	};

net.createServer(function(s) {
	if (remoteSock) {
		sys.debug('Already connected');
		return s.destroy();
	}

	var outBuf = null;

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
		if (typeof(d) === 'string')
			d = new Buffer(d, 'ascii');

		outBuf = appendBuf(outBuf, d);	

		if (outBuf.length > 1) {
			var p = Binary.parse(outBuf)
				.word8bs('packetID')
				.vars
				;

			if (p.packetID !== null) {
				var handler = serverToClient[p.packetID];

				if (handler === undefined) {
					sys.debug('Unknown packet ' + p.packetID);
					return s.end();
				}

				sys.debug(outBuf.length);

				var read = handler(outBuf.slice(1, outBuf.length), {});

				if (read > -1) {
					sys.debug((read + 1) + '/' + outBuf.length);
					outBuf = outBuf.slice(read + 1, outBuf.length);
					sys.debug('Read a ' + p.packetID);
				}

				if (read === undefined) {
					sys.debug('Unhandled packet ' + p.packetID);
					return s.end();
				}
			}
		}

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
