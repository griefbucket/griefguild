var
	net = require('net')
	, Binary = require('binary')
	, sys = require('sys')
	, remote = ['localhost', 25565]
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

var lastMessage;

function out1(s) {
	lastMessage = s;
	//sys.debug(s);
}

var itemIDs =
	{ 0 : 'air'
	, 1 : 'stone'
	, 2 : 'grass'
	, 3 : 'dirt'
	, 4 : 'cobblestone'
	, 5 : 'wooden plank'
	, 6 : 'sapling'
	, 7 : 'bedrock'
	, 8 : 'water'
	, 9 : 'stationary water'
	, 10 : 'lava'
	, 11 : 'stationary lava'
	, 12 : 'sand'
	, 13 : 'gravel'
	, 14 : 'gold ore'
	, 15 : 'iron ore'
	, 16 : 'coal ore'
	, 17 : 'wood'
	, 18 : 'leaves'
	, 19 : 'sponge'
	, 20 : 'glass'
	, 21 : 'lapis lazuli ore'
	, 22 : 'lapis lazuli block'
	, 23 : 'dispenser'
	, 24 : 'sandstone'
	, 25 : 'note block'
	, 35 : 'wool'
	, 37 : 'yellow flower'
	, 38 : 'red rose'
	, 39 : 'brown mushroom'
	, 40 : 'red mushroom'
	, 41 : 'gold block'
	, 42 : 'iron block'
	, 43 : 'double stone slab'
	, 44 : 'stone slab'
	, 45 : 'brick block'
	, 46 : 'tnt'
	, 47 : 'bookshelf'
	, 48 : 'moss stone'
	, 49 : 'obsidian'
	, 50 : 'torch'
	, 51 : 'fire'
	, 52 : 'monster spawner'
	, 53 : 'wooden stairs'
	, 54 : 'chest'
	, 55 : 'redstone wire'
	, 56 : 'diamond ore'
	, 57 : 'diamond block'
	, 58 : 'workbench'
	, 59 : 'crops'
	, 60 : 'farmland'
	, 61 : 'furnace'
	, 62 : 'burning furnace'
	, 63 : 'sign post'
	, 64 : 'wooden door'
	, 65 : 'ladder'
	, 66 : 'minecart tracks'
	, 67 : 'cobblestone stairs'
	, 68 : 'wall sign'
	, 69 : 'lever'
	, 70 : 'stone pressure plate'
	, 71 : 'iron door'
	, 72 : 'wooden pressure plate'
	, 73 : 'redstone ore'
	, 74 : 'glowing redstone ore'
	, 75 : 'redstone torch (off)'
	, 76 : 'redstone torch (on)'
	, 77 : 'stone button'
	, 78 : 'snow'
	, 79 : 'ice'
	, 80 : 'snow block'
	, 81 : 'cactus'
	, 82 : 'clay block'
	, 83 : 'sugar cane'
	, 84 : 'jukebox'
	, 85 : 'fence'
	, 86 : 'pumpkin'
	, 87 : 'netherrack'
	, 88 : 'soul sand'
	, 89 : 'glowstone block'
	, 90 : 'portal'
	, 91 : 'jack-o-lantern'
	, 92 : 'cake block'
	, 256 : 'iron shovel'
	, 257 : 'iron pickaxe'
	, 258 : 'iron axe'
	, 259 : 'flint and steel'
	, 260 : 'apple'
	, 261 : 'bow'
	, 262 : 'arrow'
	, 263 : 'coal'
	, 264 : 'diamond'
	, 265 : 'iron ingot'
	, 266 : 'gold ingot'
	, 267 : 'iron sword'
	, 268 : 'wooden sword'
	, 269 : 'wooden shovel'
	, 270 : 'wooden pickaxe'
	, 271 : 'wooden axe'
	, 272 : 'stone sword'
	, 273 : 'stone shovel'
	, 274 : 'stone pickaxe'
	, 275 : 'stone axe'
	, 276 : 'diamond sword'
	, 277 : 'diamond shovel'
	, 278 : 'diamond pickaxe'
	, 279 : 'diamond axe'
	, 280 : 'stick'
	, 281 : 'bowl'
	, 282 : 'mushroom soup'
	, 283 : 'gold sword'
	, 284 : 'gold shovel'
	, 285 : 'gold pickaxe'
	, 286 : 'gold axe'
	, 287 : 'string'
	, 288 : 'feather'
	, 289 : 'sulphur'
	, 290 : 'wooden hoe'
	, 291 : 'stone hoe'
	, 292 : 'iron hoe'
	, 293 : 'diamond hoe'
	, 294 : 'gold hoe'
	, 295 : 'seeds'
	, 296 : 'wheat'
	, 297 : 'bread'
	, 298 : 'leather helmet'
	, 299 : 'leather chestplate'
	, 300 : 'leather leggings'
	, 301 : 'leather boots'
	, 302 : 'chainmail helmet'
	, 303 : 'chainmail chestplate'
	, 304 : 'chainmail leggings'
	, 305 : 'chainmail boots'
	, 306 : 'iron helmet'
	, 307 : 'iron chestplate'
	, 308 : 'iron leggings'
	, 309 : 'iron boots'
	, 310 : 'diamond helmet'
	, 311 : 'diamond chestplate'
	, 312 : 'diamond leggings'
	, 313 : 'diamond boots'
	, 314 : 'gold helmet'
	, 315 : 'gold chestplate'
	, 316 : 'gold leggings'
	, 317 : 'gold boots'
	, 318 : 'flint'
	, 319 : 'raw porkchop'
	, 320 : 'cooked porkchop'
	, 321 : 'paintings'
	, 322 : 'golden apple'
	, 323 : 'sign'
	, 324 : 'wooden door'
	, 325 : 'bucket'
	, 326 : 'water bucket'
	, 327 : 'lava bucket'
	, 328 : 'minecart'
	, 329 : 'saddle'
	, 330 : 'iron door'
	, 331 : 'redstone'
	, 332 : 'snowball'
	, 333 : 'boat'
	, 334 : 'leather'
	, 335 : 'milk'
	, 336 : 'clay brick'
	, 337 : 'clay balls'
	, 338 : 'sugar cane'
	, 339 : 'paper'
	, 340 : 'book'
	, 341 : 'slimeball'
	, 342 : 'storage minecart'
	, 343 : 'powered minecart'
	, 344 : 'egg'
	, 345 : 'compass'
	, 346 : 'fishing rod'
	, 347 : 'clock'
	, 348 : 'glowstone dust'
	, 349 : 'raw fish'
	, 350 : 'cooked fish'
	, 351 : 'dye'
	, 352 : 'bone'
	, 353 : 'sugar'
	, 354 : 'cake'
	, 2256 : 'gold music disc'
	, 2257 : 'green music disc'
	};

var serverToClient = 
	{ 0x00 :
		/* Keep alive */
		function(buf, state) {
			out1('keep-alive');
			return 0;
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
				.word64bs('time')
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

			out1('entity equipped ' + sys.inspect(p.vars));
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

			out1('spawn position ' + sys.inspect(p.vars));
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

			out1('update health ' + sys.inspect(p.vars));
			return 2;
		}

	, 0x09 :
		/* ??? Sent when 'respawn' clicked */
		function(buf, state) {
			return 0;
		}

	, 0x0D :
		/* Player position and look */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word64bs('x')
				.word64bs('y')
				.word64bs('stance')
				.word64bs('z')
				.word32bs('yaw')
				.word32bs('pitch')
				.word8bs('on_ground')
				;

			if (p.vars.on_ground === null)
				return -1;

			out1('player position ' + sys.inspect(p.vars));
			return 8 + 8 + 8 + 8 + 4 + 4 + 1;
		}

	, 0x10 :
		/* Holding change */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word16bs('slot')
				;

			if (p.vars.slot === null)
				return -1;

			return 2;
		}

	, 0x11 :
		/* ??? */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('unknown_1')
				.word8bs('unknown_2')
				.word32bs('unknown_3')
				.word8bs('unknown_4')
				.word32bs('unknown_5')
				;

			if (p.vars.unknown_5 === null)
				return -1;

			return 4 + 1 + 4 + 1 + 4;
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

			out1('animate entity ' + sys.inspect(p.vars));
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

			out1('entity action ' + sys.inspect(p.vars));
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

			out1('named entity spawn ' + sys.inspect(p.vars));
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

			out1('pickup spawn ' + sys.inspect(p.vars));
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

			out1('collect item ' + sys.inspect(p.vars));
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

			out1('vehicle spawn ' + sys.inspect(p.vars));
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

			var md = p.vars.metadata;
			if (md === null || buf[19 + md.length] !== 0x7F)
				return -1;

			out1('mob spawn ' + sys.inspect(p.vars));
			return 4 + 1 + 4 + 4 + 4 + 1 + 1 + md.length + 1;
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

			out1('painting ' + sys.inspect(p.vars));
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

			out1('entity velocity ' + sys.inspect(p.vars));
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

			out1('destroy entity ' + sys.inspect(p.vars));
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

			out1('entity ' + sys.inspect(p.vars));
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

			out1('entity relative move ' + sys.inspect(p.vars));
			return 4 + 1 + 1 + 1;
		}

	, 0x20 :
		/* Entity look */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('entity_id')
				.word8bs('yaw')
				.word8bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			out1('entity look ' + sys.inspect(p.vars));
			return 4 + 1 + 1;
		}

	, 0x21 :
		/* Entity look and relative move */
		function(buf, state) {
			var p = Binary.parse(buf);
			p	
				.word32bs('entity_id')
				.word8bs('rel_x')
				.word8bs('rel_y')
				.word8bs('rel_z')
				.word8bs('yaw')
				.word8bs('pitch')
				;

			if (p.vars.pitch === null)
				return -1;

			out1('entity look & move ' + sys.inspect(p.vars));
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

			out1('entity teleport ' + sys.inspect(p.vars));
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

			out1('entity status ' + sys.inspect(p.vars));
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
			if (md === null || buf[4 + md.length] !== 0x7F)
				return -1;

			out1('entity metadata ' + sys.inspect(p.vars));
			return 4 + md.length + 1;
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

			out1('prechunk ' + sys.inspect(p.vars));
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

			if (p.vars.len_data === null)
				return -1;

			if (p.vars.data.length < p.vars.len_data)
				return -1;

			out1('map chunk ' + sys.inspect(p.vars));
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

			out1('multi block change ' + sys.inspect(p.vars));
			return 4 + 4 + 2 + 4 * (p.vars.len_array);
		}

	, 0x35 :
		/* Block change */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word32bs('x')
				.word8bs('y')
				.word32bs('z')
				.word8bs('type')
				.word8bs('metadata')
				;

			if (p.vars.metadata === null)
				return -1;

			out1('block change ' + sys.inspect(p.vars));
			return 4 + 1 + 4 + 1 + 1;
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

			out1('play note ' + sys.inspect(p.vars));
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

			out1('explosion ' + sys.inspect(p.vars));
			return 8 + 8 + 8 + 4 + 4 + 3 * p.vars.count;
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

			out1('open window ' + sys.inspect(p.vars));
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

			out1('close window ' + sys.inspect(p.vars));
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

			out1('set slot ' + sys.inspect(p.vars));
			return 1 + 2 + 2 + 1 + 2;
		}

	, 0x68 :
		/* Window items */
		function(buf, state) {
			var p = Binary.parse(buf);
			p
				.word8bs('window_id')
				.word16bs('count')
				;

			if (p.vars.count === null)
				return -1;

			var read = 1 + 2;

			for (var i = 0; i < p.vars.count; ++i) {
				var p2 = Binary.parse(buf.slice(read, buf.length));
				p2
					.word16bs('item_id')
					.word8bs('count')
					.word16bs('uses')
					;

				if (p2.vars.item_id === -1) {
					read += 2;
					continue;
				}
				else {
					read += 2 + 1 + 2;
					continue;
				}
			}

			return read;
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

			out1('update progress ' + sys.inspect(p.vars));
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

			out1('transaction status ' + sys.inspect(p.vars));
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

			out1('update sign ' + sys.inspect(p.vars));
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

			out1('disconnect ' + sys.inspect(p.vars));
			return 2 * p.vars.len_reason;
		}
	};

net.createServer(function(sLocal) {
	var outBuf = null;

	sys.debug('Connecting to remote');

	sRemote = net.createConnection(remote[1], remote[0]);

	sLocal.on('data', function(d) {
		sRemote.write(d);
	});

	sLocal.on('end', function() {
		sys.debug('Ending connection to remote');
		sRemote.end();
	});

	sRemote.on('data', function(d) {
		if (typeof(d) === 'string')
			d = new Buffer(d, 'ascii');

		outBuf = appendBuf(outBuf, d);	

		/* There's a bug in Binary.scan with the
		 * version of node that I'm running which causes
		 * it to fuck up if the thing isn't in the stream...
		 * so introduce some delay */
		while (outBuf.length > 3000) {
			var p = Binary.parse(outBuf)
				.word8bu('packetID')
				.vars
				;

			if (outBuf.length > 2 * 1024 * 1024) {
				sys.debug('Too much unparsed data, quitting');
				sys.debug('Sitting on a ' + p.packetID);
				sys.debug('Last message ' + lastMessage);
				sys.debug(sys.inspect(outBuf.slice(0, 64)));
				return sLocal.end();
			}

			if (p.packetID !== null) {
				var handler = serverToClient[p.packetID];

				if (handler === undefined) {
					sys.debug('Unknown packet ' + p.packetID);
					sys.debug('Last message ' + lastMessage);
					return sLocal.end();
				}

				var read = handler(outBuf.slice(1, outBuf.length), {});

				if (read === undefined) {
					sys.debug('Unhandled packet ' + p.packetID);
					sys.debug('Last message ' + lastMessage);
					return sLocal.end();
				}

				if (read > -1) {
					outBuf = outBuf.slice(read + 1, outBuf.length);
				}
				else if (read === -1) {
					break;
				}
			}
		}

		sLocal.write(d);
	});

	sRemote.on('end', function() {
		sys.debug('Ending connection to local');
		sLocal.end();
	});
}).listen(6000);

sys.debug('Listening on 6000');
