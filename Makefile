all:
	rm -f src/*.gch 

	g++ -g src/* -lzmq

	rm -f src/*.gch
