all:
	rm -f src/*.gch 

	g++ -g src/* -lz

	rm -f src/*.gch
