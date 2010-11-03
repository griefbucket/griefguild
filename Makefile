all:
	rm -f src/*.gch 

	g++ -g src/* 

	rm -f src/*.gch
