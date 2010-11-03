#include "connection.h"

namespace grief {
	Connection::Connection(const std::string &host, int port) 
		: TCPConnection(host, port)
	{
		
	}

	Connection::~Connection() {

	}
};
