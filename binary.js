exports.Reader = function(buf) {
	var obj = {};

	var vars = {};
	var off = 0;
	var end = false;

	obj.word8bs = function(key) {
		if (end || buf.length < 1) {
			vars[key] = null;
			end = true;
			return obj;
		}

		vars[key] = buf[0];
		off += 1;
		buf = buf.slice(1, buf.length);

		return obj;
	};

	obj.word16bs = function(key) {
		if (end || buf.length < 2) {
			vars[key] = null;
			end = true;
			return obj;
		}

		vars[key] 
			= (buf[0] << 8) 
			| (buf[1])
			;

		off += 2;
		buf = buf.slice(2, buf.length);

		return obj;
	};

	obj.word32bs = function(key) {
		if (end || buf.length < 4) {
			vars[key] = null;
			end = true;
			return obj;
		}

		vars[key] 
			= (buf[0] << 24) 
			| (buf[1] << 16)
			| (buf[2] << 8)
			| (buf[3])
			;

		off += 4;
		buf = buf.slice(4, buf.length);

		return obj;
	};

	obj.word64bs = function(key) {
		if (end || buf.length < 8) {
			vars[key] = null;
			end = true;
			return obj;
		}

		vars[key]
			= (buf[0] * Math.pow(2, 56))
			+ (buf[1] * Math.pow(2, 48))
			+ (buf[2] * Math.pow(2, 40))
			+ (buf[3] * Math.pow(2, 32))
			+ (buf[4] << 24)
			+ (buf[5] << 16)
			+ (buf[6] << 8)
			+ (buf[7])
			;

		off += 8;
		buf = buf.slice(8, buf.length);
		
		return obj;
	};

	obj.buffer = function(key, len) {
		if (typeof(len) === 'string') {
			len = vars[len];
		}

		if (end || buf.length < len) {
			vars[key] = null;
			end = true;
			return obj;
		}

		vars[key] = buf.slice(0, len);
		off += len;
		buf = buf.slice(len, buf.length);

		return obj;
	}

	obj.until = function(key, stop) {
		if (!end) {
			for 
				( var i = 0
				; i < buf.length
				; ++i
				)
			{
				if (buf[i] == stop) {
					i += 1;

					vars[key] = buf.slice(0, i);
					off += i;
					buf = buf.slice(i, buf.length);
					return obj;
				}
			}
		}

		vars[key] = null;
		end = true;
		return obj;
	}

	obj.vars = function() {
		return vars;
	}

	obj.read = function() {
		return off;
	}

	return obj;
}
