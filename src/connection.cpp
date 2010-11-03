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
