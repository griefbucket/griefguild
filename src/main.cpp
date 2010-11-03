#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#include <string>
#include <iostream>

int main(int argc, char **argv) {
	int s;
	struct sockaddr_in sin; 
	struct hostent *host;

	if (0 > (s = socket(AF_INET, SOCK_STREAM, 0))) {
		std::cout << "Unable to create socket" << std::endl;
		return 1;
	}

	sin.sin_family = AF_INET;
	sin.sin_port = htons(25565);
	
	if (NULL == (host = gethostbyname("174.36.153.143"))) {
		std::cout << "Unable to resolve host" << std::endl;
		return 1;
	}

	memcpy(&sin.sin_addr, host->h_addr, host->h_length);

	if (0 > connect(s, (struct sockaddr*) &sin, sizeof(sin))) {
		std::cout << "Unable to connect" << std::endl;
		return 1;
	}

	std::cout << "Connected!" << std::endl;

	if (0 > close(s)) {
		std::cout << "Error while closing socket" << std::endl;
		return 1;
	}

	return 0;
}
