#ifndef GUARD_GRIEF_TCPCONNECTION
#define GUARD_GRIEF_TCPCONNECTION

#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#include <string>

namespace grief {
	class TCPConnection {
		int sock;
		struct sockaddr_in sin;
		struct hostent *host;

	public:
		TCPConnection(const std::string& host, int port);
		virtual ~TCPConnection();

	protected:
		void send(void *buf, size_t size);
		void recv(void *buf, size_t size);
	};
};

#endif
