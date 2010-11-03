#ifndef GUARD_GRIEF_CONNECTION
#define GUARD_GRIEF_CONNECTION

#include "tcpconnection.h"
#include "messages.h"

#include <string>

namespace grief {
	class Connection : private TCPConnection {
		char *buf;
		size_t bufSize;

		IMessage *msgBuf;

	public:
		Connection(const std::string& host, int port = 25565);
		virtual ~Connection();

		IMessage *nextMessage();
	};
}

#endif
