#ifndef GUARD_GRIEF_MESSAGES
#define GUARD_GRIEF_MESSAGES

#include "connection.h"
#include "inventory.h"
#include "map.h"

#include <string>

namespace grief {
	enum MessageType 
		{ KEEP_ALIVE = 0x00
		, LOGIN = 0x01
		, HANDSHAKE = 0x02
		, CHAT = 0x03
		, TIME_UPDATE = 0x04
		, INVENTORY_LIST = 0x05
		, PLAYER_SPAWN = 0x06
		, PLAYER = 0x0A
		, PLAYER_MOVE = 0x0B
		, PLAYER_LOOK = 0x0C
		, PLAYER_MOVE_LOOK = 0x0D
		, PLAYER_DIG = 0x0E
		, PLAYER_BLOCK_PLACE = 0x0F
		, PLAYER_HOLD = 0x10
		, INVENTORY_ADD = 0x11
		, ENTITY_SWING = 0x12
		, ENTITY_SPAWN = 0x14
		, PICKUP_SPAWN = 0x15
		, PICKUP_COLLECT = 0x16
		, OBJECT_SPAWN = 0x17
		, MOB_SPAWN = 0x18
		, ENTITY_DESTROY = 0x1D
		, ENTITY = 0x1E
		, ENTITY_MOVE = 0x1F
		, ENTITY_LOOK = 0x20
		, ENTITY_LOOK_MOVE = 0x21
		, ENTITY_TELEPORT = 0x22
		, CHUNK_PRELOAD = 0x32
		, CHUNK_DATA = 0x33
		, BLOCK_CHANGE_MULTI = 0x34
		, BLOCK_CHANGE = 0x35
		, ENTITY_COMPLEX = 0x3B
		, DISCONNECT = 0xFF
		};

	typedef int EntityID;
	typedef short ItemID;

	class IMessage {
	public:
		virtual void send(Connection *conn);
		virtual void recv(Connection *conn);
	};

	template <int type> class Message;

	template <>
	class Message<KEEP_ALIVE> : IMessage {
	public:
		virtual void send(Connection *conn) {
			conn->write(KEEP_ALIVE);
		}

		virtual void recv(Connection *conn) {
		}
	};

	template <>
	class Message<LOGIN> : IMessage {
	public:
		int protocolVersion;
		std::string username;
		std::string password;
		long mapSeed;
		char dimension;

		virtual void send(Connection *conn) {
			conn->write(protocolVersion);
			conn->write(username);
			conn->write(password);
			conn->write(mapSeed);
			conn->write(dimension);
		}

		virtual void recv(Connection *conn) {
			protocolVersion = conn->read<int>();
			username = conn->read<std::string>();
			password = conn->read<std::string>();
			mapSeed = conn->read<long>();
			dimension = conn->read<char>();
		}
	};

	template <>
	class Message<HANDSHAKE> : IMessage {
	public:
		std::string username;

		virtual void send(Connection *conn) {
			conn->write(username);
		}

		virtual void recv(Connection *conn) {
			username = conn->read<std::string>();
		}
	};

	template <>
	class Message<CHAT> : IMessage {
	public:
		std::string message;

		virtual void send(Connection *conn) {
			conn->write(message);
		}

		virtual void recv(Connection *conn) {
			message = conn->read<std::string>();
		}
	};

	template <>
	class Message<TIME_UPDATE> : IMessage {
	public:
		long time;

		virtual void send(Connection *conn) {
			conn->write(time);
		}

		virtual void recv(Connection *conn) {
			time = conn->read<long>();
		}
	};

	template <>
	class Message<INVENTORY_LIST> : IMessage {
	public:
		Inventory inv;

		virtual void send(Connection *conn) {
			conn->write(inv.type);
			conn->write((short) inv.items.size());

			for ( Inventory::ItemList::const_iterator i = inv.items.begin()
				; i != inv.items.end()
				; ++i
				)
			{
				conn->write(i->id);

				if (i->id != -1) {
					conn->write(i->count);
					conn->write(i->health);
				}
			}
		}

		virtual void recv(Connection *conn) {
			inv.type = conn->read<InventoryType>();
			short count = conn->read<short>();

			inv.items.reserve(count);
			
			for (short i = 0; i < count; ++i) {
				Item item;
				item.id = conn->read<ItemType>();

				if (item.id != -1) {
					item.count = conn->read<char>();
					item.health = conn->read<short>();
				}

				inv.items.push_back(item);
			}
		}
	};

	template <>
	class Message<PLAYER_SPAWN> : IMessage {
	public:
		int x, y, z;

		virtual void send(Connection *conn) {
			conn->write(x);
			conn->write(y);
			conn->write(z);
		}

		virtual void recv(Connection *conn) {
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
		}
	};

	template <>
	class Message<PLAYER> : IMessage {
	public:
		bool onGround;

		virtual void send(Connection *conn) {
			conn->write(onGround);
		}

		virtual void recv(Connection *conn) {
			onGround = conn->read<bool>();
		}
	};

	template <>
	class Message<PLAYER_MOVE> : IMessage {
	public:
		double x, y, stance, z;
		bool onGround;

		virtual void send(Connection *conn) {
			conn->write(x);
			conn->write(y);
			conn->write(stance);
			conn->write(z);
			conn->write(onGround);
		}

		virtual void recv(Connection *conn) {
			x = conn->read<double>();
			y = conn->read<double>();
			stance = conn->read<double>();
			z = conn->read<double>();
			onGround = conn->read<bool>();
		}
	};

	template <>
	class Message<PLAYER_LOOK> : IMessage {
	public:
		float yaw, pitch;
		bool onGround;

		virtual void send(Connection *conn) {
			conn->write(yaw);
			conn->write(pitch);
			conn->write(onGround);
		}

		virtual void recv(Connection *conn) {
			yaw = conn->read<float>();
			pitch = conn->read<float>();
			onGround = conn->read<bool>();
		}
	};

	template <>
	class Message<PLAYER_MOVE_LOOK> : IMessage {
	public:
		double x, y, stance, z;
		float yaw, pitch;
		bool onGround;

		virtual void send(Connection *conn) {
			conn->write(x);
			conn->write(y);
			conn->write(stance);
			conn->write(z);
			conn->write(yaw);
			conn->write(pitch);
			conn->write(onGround);
		}

		virtual void recv(Connection *conn) {
			x = conn->read<double>();
			y = conn->read<double>();
			stance = conn->read<double>();
			z = conn->read<double>();
			yaw = conn->read<float>();
			pitch = conn->read<float>();
			onGround = conn->read<bool>();
		}
	};

	template <>
	class Message<PLAYER_DIG> : IMessage {
	public:
		char status;
		int x;
		char y;
		int z;
		char face;

		virtual void send(Connection *conn) {
			conn->write(status);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(face);
		}

		virtual void recv(Connection *conn) {
			status = conn->read<char>();
			x = conn->read<int>();
			y = conn->read<char>();
			z = conn->read<int>();
			face = conn->read<char>();
		}
	};

	template <>
	class Message<PLAYER_BLOCK_PLACE> : IMessage {
	public:
		ItemID item;
		int x;
		char y;
		int z;
		char direction;

		virtual void send(Connection *conn) {
			conn->write(item);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(direction);
		}

		virtual void recv(Connection *conn) {
			item = conn->read<ItemID>();
			x = conn->read<int>();
			y = conn->read<char>();
			z = conn->read<int>();
			direction = conn->read<char>();
		}
	};

	template <>
	class Message<PLAYER_HOLD> : IMessage {
	public:
		int unused;
		ItemID item;

		virtual void send(Connection *conn) {
			conn->write(unused);
			conn->write(item);
		}

		virtual void recv(Connection *conn) {
			unused = conn->read<int>();
			item = conn->read<ItemID>();
		}
	};

	template <>
	class Message<INVENTORY_ADD> : IMessage {
	public:
		ItemID item;
		char count;
		short life;

		virtual void send(Connection *conn) {
			conn->write(item);
			conn->write(count);
			conn->write(life);
		}

		virtual void recv(Connection *conn) {
			item = conn->read<ItemID>();
			count = conn->read<char>();
			life = conn->read<short>();
		}
	};

	template <>
	class Message<ENTITY_SWING> : IMessage {
	public:
		EntityID entity;
		bool animate;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(animate);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			animate = conn->read<bool>();
		}
	};

	template <>
	class Message<ENTITY_SPAWN> : IMessage {
	public:
		EntityID entity;
		std::string playerName;
		int x, y, z;
		char rotation;
		char pitch;
		short holdingItemId;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(playerName);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(rotation);
			conn->write(pitch);
			conn->write(holdingItemId);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			playerName = conn->read<std::string>();
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
			rotation = conn->read<char>();
			pitch = conn->read<char>();
			holdingItemId = conn->read<short>();
		}
	};

	template <>
	class Message<PICKUP_SPAWN> : IMessage {
	public:
		EntityID entity;
		ItemID item;
		char count;
		int x, y, z;
		char rotation;
		char pitch;
		char roll;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(item);
			conn->write(count);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(rotation);
			conn->write(pitch);
			conn->write(roll);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			item = conn->read<ItemID>();
			count = conn->read<char>();
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
			rotation = conn->read<char>();
			pitch = conn->read<char>();
			roll = conn->read<char>();
		}
	};

	template <>
	class Message<PICKUP_COLLECT> : IMessage {
	public:
		ItemID item;
		EntityID entity;

		virtual void send(Connection *conn) {
			conn->write(item);
			conn->write(entity);
		}
		
		virtual void recv(Connection *conn) {
			item = conn->read<ItemID>();
			entity = conn->read<EntityID>();
		}
	};

	template <>
	class Message<OBJECT_SPAWN> : IMessage {
	public:
		EntityID entity;
		char type;
		int x, y, z;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(type);
			conn->write(x);
			conn->write(y);
			conn->write(z);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			type = conn->read<char>();
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
		}
	};

	template <>
	class Message<MOB_SPAWN> : IMessage {
	public:
		EntityID entity;
		char type;
		int x, y, z;
		char yaw, pitch;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(type);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(yaw);
			conn->write(pitch);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			type = conn->read<char>();
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
			yaw = conn->read<char>();
			pitch = conn->read<char>();
		}
	};

	template <>
	class Message<ENTITY_DESTROY> : IMessage {
	public:
		EntityID entity;

		virtual void send(Connection *conn) {
			conn->write(entity);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
		}
	};

	template <>
	class Message<ENTITY> : IMessage {
	public:
		EntityID entity;

		virtual void send(Connection *conn) {
			conn->write(entity);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
		}
	};

	template <>
	class Message<ENTITY_MOVE> : IMessage {
	public:
		EntityID entity;
		char x, y, z;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(x);
			conn->write(y);
			conn->write(z);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			x = conn->read<char>();
			y = conn->read<char>();
			z = conn->read<char>();
		}
	};

	template <>
	class Message<ENTITY_LOOK> : IMessage {
	public:
		EntityID entity;
		char yaw, pitch;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(yaw);
			conn->write(pitch);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			yaw = conn->read<char>();
			pitch = conn->read<char>();
		}
	};

	template <>
	class Message<ENTITY_LOOK_MOVE> : IMessage {
	public:
		EntityID entity;
		char x, y, z;
		char yaw, pitch;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(yaw);
			conn->write(pitch);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			x = conn->read<char>();
			y = conn->read<char>();
			z = conn->read<char>();
			yaw = conn->read<char>();
			pitch = conn->read<char>();
		}
	};

	template <>
	class Message<ENTITY_TELEPORT> : IMessage {
	public:
		EntityID entity;
		int x, y, z;
		char yaw, pitch;

		virtual void send(Connection *conn) {
			conn->write(entity);
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(yaw);
			conn->write(pitch);
		}

		virtual void recv(Connection *conn) {
			entity = conn->read<EntityID>();
			x = conn->read<int>();
			y = conn->read<int>();
			z = conn->read<int>();
			yaw = conn->read<char>();
			pitch = conn->read<char>();
		}
	};

	template <>
	class Message<CHUNK_PRELOAD> : IMessage {
	public:
		int x, z;
		bool mode;

		virtual void send(Connection *conn) {
			conn->write(x);
			conn->write(z);
			conn->write(mode);
		}

		virtual void recv(Connection *conn) {
			x = conn->read<int>();
			z = conn->read<int>();
			mode = conn->read<bool>();
		}
	};

	template <>
	class Message<CHUNK_DATA> : IMessage {
	public:
		MapChunk chunk;

		virtual void send(Connection *conn) {
			/* XXX */
		}

		virtual void recv(Connection *conn) {
			chunk.x = conn->read<int>();
			chunk.y = conn->read<short>();
			chunk.z = conn->read<int>();
			chunk.sizeX = ((short) conn->read<char>()) + 1;
			chunk.sizeY = ((short) conn->read<char>()) + 1;
			chunk.sizeZ = ((short) conn->read<char>()) + 1;

			int compressedSize = conn->read<int>();
			char *rawData = conn->readCompressedBytes(compressedSize);
			long numBlocks = chunk.sizeX * chunk.sizeY * chunk.sizeZ;

			for (long i = 0; i < numBlocks; ++i) 
				chunk.block(i).type = *(rawData++);

			for (long i = 0; i < numBlocks; i += 2) {
				/* Q: Are these in the right order? */
				chunk.block(i).meta = (*rawData) & 0x0F;
				chunk.block(i+1).meta = (*rawData++) & 0xF0;
			}

			for (long i = 0; i < numBlocks; i += 2) {
				/* Q: ordering? */
				chunk.block(i).light = (*rawData) & 0x0F;
				chunk.block(i+1).light = (*rawData++) & 0xF0;
			}

			for (long i = 0; i < numBlocks; i += 2) {
				/* Q: ordering */
				chunk.block(i).skylight = (*rawData) & 0x0F;
				chunk.block(i).skylight = (*rawData++) & 0xF0;
			}
		}
	};

	template <>
	class Message<BLOCK_CHANGE_MULTI> : IMessage {
	public:
		int chunkX, chunkZ;
		short numBlocks;
		short *coords;
		short *types;
		short *metadata;

		virtual void send(Connection *conn) {
			/* XXX */
		}

		virtual void recv(Connection *conn) {
			/* XXX */
		}
	};

	template <>
	class Message<BLOCK_CHANGE> : IMessage {
	public:
		int x;
		char y;
		int z;
		char type;
		char metadata;

		virtual void send(Connection *conn) {
			conn->write(x);
			conn->write(y);
			conn->write(z);
			conn->write(type);
			conn->write(metadata);
		}

		virtual void recv(Connection *conn) {
			x = conn->read<int>();
			y = conn->read<char>();
			z = conn->read<int>();
			type = conn->read<char>();
			metadata = conn->read<char>();
		}
	};

	template <>
	class Message<ENTITY_COMPLEX> : IMessage {
	public:
		int x;
		short y;
		int z;
		short payloadSize;
		char *payload;

		virtual void send(Connection *conn) {
			/* XXX */
		}

		virtual void recv(Connection *conn) {
			/* XXX */
		}
	};

	template <>
	class Message<DISCONNECT> : IMessage {
	public:
		std::string reason;

		virtual void send(Connection *conn) {
			conn->write(reason);
		}

		virtual void recv(Connection *conn) {
			reason = conn->read<std::string>();
		}
	};
}

#endif
