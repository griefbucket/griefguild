#include "connection.h"
#include <exception>

namespace grief {
	Connection::Connection(std::string hostname, int port) {
		if (0 > (this->sock = socket(AF_INET, SOCK_STREAM, 0))) {
			throw std::exception();
		}

		sin.sin_family = AF_INET;
		sin.sin_port = htons(port);

		if (NULL == (host = gethostbyname(hostname.c_str()))) {
			throw std::exception();
		}

		memcpy(&sin.sin_addr, host->h_addr, host->h_length);
	}

	Connection::~Connection() {
		close(sock);
	}

	void Connection::send(void *buf, size_t size) {
		if (0 > ::send(sock, buf, size, 0)) {
			throw std::exception();
		}
	}

	void Connection::recv(void *buf, size_t size) {
		if (0 > ::recv(sock, buf, size, MSG_WAITALL)) {
			throw std::exception();
		}
	}
};
