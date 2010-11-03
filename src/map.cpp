#include "map.h"

#include <exception>

namespace grief {
	MapChunk::MapChunk()
		: blocks(0)
		, sizeX(0)
		, sizeY(0)
		, sizeZ(0)
	{}

	MapChunk::~MapChunk() {
		if (blocks)
			delete[] blocks;
	}

	Block& MapChunk::block(short rx, short ry, short rz) {
		alloc();
		return blocks
			[ ry
			+ (rz * sizeY)
			+ (rx * sizeY * sizeZ)
			];
	}

	void MapChunk::alloc() {
		if (blocks) return;

		long count = sizeX * sizeY * sizeZ;
		if (count < 1)
			throw std::exception();

		blocks = new Block[count];
	}
};
