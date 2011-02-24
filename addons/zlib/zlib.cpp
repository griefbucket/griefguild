#include <zlib.h>
#include <v8.h>
#include <node.h>
#include <node_buffer.h>
#include <string.h>
#include <iostream>

using namespace v8;
using namespace node;

Handle<Value> inflate(const Arguments &args) {
	if (args.Length() != 1) {
		return ThrowException(Exception::TypeError(String::New("zlib.inflate expects 1 argument")));
	}

	z_stream strm;
	strm.zalloc = Z_NULL;
	strm.zfree = Z_NULL;
	strm.opaque = Z_NULL;
	strm.avail_in = 0;
	strm.next_in = Z_NULL;

	if (Z_OK != inflateInit(&strm)) {
		return ThrowException(String::New("inflateInit failed"));		
	}

	const size_t CHUNK = 1024 * 1024 * 5;
	unsigned char *out = new unsigned char[CHUNK];

	Buffer *buf = ObjectWrap::Unwrap<Buffer>(args[0]->ToObject());

	strm.avail_in = buf->length();
	strm.next_in = (unsigned char*) buf->data();

	strm.avail_out = CHUNK;
	strm.next_out = out;

	if (Z_STREAM_END != inflate(&strm, Z_NO_FLUSH)) {
		inflateEnd(&strm);
		delete[] out;
		return ThrowException(String::New("inflate failed"));
	}

	size_t have = CHUNK - strm.avail_out;
	Buffer *outBuffer = Buffer::New(have);
	memcpy(outBuffer->data(), out, have);

	inflateEnd(&strm);
	delete[] out;
	return outBuffer->handle_;
}

Handle<Value> deflate(const Arguments &args) {
	return Undefined();
}

extern "C" void init(Handle<Object> target) {
	HandleScope *scope;
	Local<FunctionTemplate> t;
	
	t = FunctionTemplate::New(&inflate);
	target->Set(String::NewSymbol("inflate"), t->GetFunction());

	t = FunctionTemplate::New(&deflate);
	target->Set(String::NewSymbol("deflate"), t->GetFunction());
}
