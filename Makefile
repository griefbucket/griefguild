all:
	g++ -g src/* -lzmq
	rm src/*.gch
