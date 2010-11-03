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

	IMessage* Connection::nextMessage() {
		return NULL;
	}
};
