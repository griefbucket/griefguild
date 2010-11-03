#include "tcpconnection.h"
#include <iostream>

int main(int argc, char **argv) {
	grief::TCPConnection c("minecraft", 25526);

	std::cout << "Connected!" << std::endl;

	return 0;
}
