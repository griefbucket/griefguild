#ifndef GUARD_GRIEF_CONNECTION
#define GUARD_GRIEF_CONNECTION

#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#include <string>

namespace grief {
	class Connection {
		int sock;
		struct sockaddr_in sin;
		struct hostent *host;

	public:
		Connection(std::string host, int port);
		~Connection();
	};
};

#endif
