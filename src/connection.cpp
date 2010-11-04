#include "connection.h"
#include "messages.h"

namespace grief {
	Connection::Connection(const std::string &host, int port) 
		: TCPConnection(host, port)
		, buf(NULL)
		, bufSize(0)
	{
		
	}

	Connection::~Connection() {
		delete[] buf;
	}

	char* Connection::readCompressedBytes(size_t len, size_t *sizeOut) {
		const size_t CHUNKSIZE = 16384;
		unsigned char out[CHUNKSIZE];
		unsigned int have;
		unsigned int bufUsed = 0;
		int ret;
		char *source = readBytes(len);

		z_stream strm;
		strm.zalloc = Z_NULL;
		strm.zfree = Z_NULL;
		strm.opaque = Z_NULL;
		strm.avail_in = 0;
		strm.next_in = Z_NULL;

		if (Z_OK != inflateInit(&strm))
			throw std::exception();

		strm.avail_in = len;
		strm.next_in = (Bytef*) source;

		do {
			strm.avail_out = CHUNKSIZE;
			strm.next_out = out;

			int ret = inflate(&strm, Z_NO_FLUSH);
			if (ret != Z_OK && ret != Z_STREAM_END)
				throw std::exception();

			have = CHUNKSIZE - strm.avail_out;

			/* Allocate a bigger buffer if necessary */
			if (bufUsed + have > bufSize) {
				bufSize *= 2;
				char *newBuf = new char[bufSize];
				memcpy(newBuf, buf, bufUsed);
				delete[] buf;
				buf = newBuf;
			}

			memcpy(buf + bufUsed, out, have);
			bufUsed += have;
		}
		while (strm.avail_out == 0);

		if (ret != Z_STREAM_END)
			throw std::exception();

		if (sizeOut)
			*sizeOut = bufUsed;

		return buf;
	}

	IMessage* Connection::nextMessage() {
		if (msg) delete msg;

		/* XXX: OH GOD MASSIVE SWITCH TABLE */

		return msg;
	}

	char* Connection::readBytes(size_t len) {
		if (bufSize < len) {
			delete[] buf;
			buf = new char[len + 1];
		}

		memset(buf, 0, len + 1);

		TCPConnection::recv(buf, len);
		return buf;
	}

	void Connection::writeBytes(void *buf, size_t len) {
		TCPConnection::send(buf, len);
	}
};
