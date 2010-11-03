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

	char *readCompressedBytes(size_t len) {
		const size_t CHUNKSIZE = 4096;
		unsigned char out[CHUNKSIZE];
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
		strm.next_in = source;

		do {
			strm.avail_out = CHUNK;
			strm.next_out = out;

			if (Z_OK != inflate(&strm, Z_NO_FLUSH))
				throw std::exception();

			/* XXX */
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
