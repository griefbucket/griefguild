#!/bin/sh
g++ \
	-g \
	-fPIC -DPIC \
	-shared \
	-DEV_MULTIPLICITY=0 \
	-I/usr/local/include/node \
	-I/opt/local/include/node \
	-L/usr/local/lib \
	-L/opt/local/lib \
	-lz \
	-o zlib.node \
	*.cpp
