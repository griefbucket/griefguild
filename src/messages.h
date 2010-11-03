#ifndef GUARD_GRIEF_MESSAGES
#define GUARD_GRIEF_MESSAGES

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
	protected:
		char *msgbuf;
		size_t msgsize;

	public:
		virtual ~IMessage() {
			if (msgbuf)
				delete[] msgbuf;
		}

		virtual void serialize(void **buf, size_t *size);
	};

	template <int type> class Message;

	template <>
	class Message<KEEP_ALIVE> : IMessage {
	public:
		virtual void serialize(void **buf, size_t *size) {
			msgbuf = new char[1];
			*buf = msgbuf;
			*size = 0;
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
	};

	template <>
	class Message<HANDSHAKE> : IMessage {
	public:
		std::string username;
	};

	template <>
	class Message<CHAT> : IMessage {
	public:
		std::string message;
	};

	template <>
	class Message<TIME_UPDATE> : IMessage {
	public:
		long time;
	};

	template <>
	class Message<INVENTORY_LIST> : IMessage {
	public:
		int type;
		short count;
		char *payload;
	};

	template <>
	class Message<PLAYER_SPAWN> : IMessage {
	public:
		int x, y, z;
	};

	template <>
	class Message<PLAYER> : IMessage {
	public:
		bool onGround;
	};

	template <>
	class Message<PLAYER_MOVE> : IMessage {
	public:
		double x, y, stance, z;
		bool onGround;
	};

	template <>
	class Message<PLAYER_LOOK> : IMessage {
	public:
		float yaw, pitch;
		bool onGround;
	};

	template <>
	class Message<PLAYER_MOVE_LOOK> : IMessage {
	public:
		double x, y, stance, z;
		float yaw, pitch;
		bool onGround;
	};

	template <>
	class Message<PLAYER_DIG> : IMessage {
	public:
		char status;
		int x;
		char y;
		int z;
		char face;
	};

	template <>
	class Message<PLAYER_BLOCK_PLACE> : IMessage {
	public:
		ItemID item;
		int x;
		char y;
		int z;
		char direction;
	};

	template <>
	class Message<PLAYER_HOLD> : IMessage {
	public:
		int unused;
		ItemID item;
	};

	template <>
	class Message<INVENTORY_ADD> : IMessage {
	public:
		ItemID item;
		char count;
		short life;
	};

	template <>
	class Message<ENTITY_SWING> : IMessage {
	public:
		EntityID entity;
		bool animate;
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
	};

	template <>
	class Message<PICKUP_COLLECT> : IMessage {
	public:
		ItemID item;
		EntityID entity;
	};

	template <>
	class Message<OBJECT_SPAWN> : IMessage {
	public:
		EntityID entity;
		char type;
		int x, y, z;
	};

	template <>
	class Message<MOB_SPAWN> : IMessage {
	public:
		EntityID entity;
		char type;
		int x, y, z;
		char yaw, pitch;
	};

	template <>
	class Message<ENTITY_DESTROY> : IMessage {
	public:
		EntityID entity;
	};

	template <>
	class Message<ENTITY> : IMessage {
	public:
		EntityID entity;
	};

	template <>
	class Message<ENTITY_MOVE> : IMessage {
	public:
		EntityID entity;
		char x, y, z;
	};

	template <>
	class Message<ENTITY_LOOK> : IMessage {
	public:
		EntityID entity;
		char yaw, pitch;
	};

	template <>
	class Message<ENTITY_LOOK_MOVE> : IMessage {
	public:
		EntityID entity;
		char x, y, z;
		char yaw, pitch;
	};

	template <>
	class Message<ENTITY_TELEPORT> : IMessage {
	public:
		EntityID entity;
		int x, y, z;
		char yaw, pitch;
	};

	template <>
	class Message<CHUNK_PRELOAD> : IMessage {
	public:
		int x, z;
		bool mode;
	};

	template <>
	class Message<CHUNK_DATA> : IMessage {
	public:
		int x;
		short y;
		int z;
		char sizeX, sizeY, sizeZ;
		int compressedSize;
		char *compressedData;
	};

	template <>
	class Message<BLOCK_CHANGE_MULTI> : IMessage {
	public:
		int chunkX, chunkZ;
		short numBlocks;
		short *coords;
		short *types;
		short *metadata;
	};

	template <>
	class Message<BLOCK_CHANGE> : IMessage {
	public:
		int x;
		char y;
		int z;
		char type;
		char metadata;
	};

	template <>
	class Message<ENTITY_COMPLEX> : IMessage {
	public:
		int x;
		short y;
		int z;
		short payloadSize;
		char *payload;
	};

	template <>
	class Message<DISCONNECT> : IMessage {
	public:
		std::string reason;
	};
}

#endif
