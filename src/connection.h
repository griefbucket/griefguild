#ifndef GUARD_GRIEF_CONNECTION
#define GUARD_GRIEF_CONNECTION

#include "tcpconnection.h"

#include <string>

namespace grief {
	class Connection : private TCPConnection {
	public:
		Connection(const std::string& host, int port = 25565);
		virtual ~Connection();
	};
}

#endif
