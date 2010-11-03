#include "connection.h"
#include <iostream>

int main(int argc, char **argv) {
	grief::Connection c("minecraft", 25526);

	std::cout << "Connected!" << std::endl;

	return 0;
}
