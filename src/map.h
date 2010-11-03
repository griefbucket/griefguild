#ifndef GUARD_GRIEF_MAP
#define GUARD_GRIEF_MAP

namespace grief {
	struct Block {
		char type;
		char meta;
		char light;
		char skylight;
	};

	struct MapChunk {
		int x;
		short y;
		int z;
		short sizeX, sizeY, sizeZ;
		Block *blocks;

		MapChunk();
		~MapChunk();

		Block &block(short x, short y, short z);

	private:
		void alloc();
	};
};

#endif
