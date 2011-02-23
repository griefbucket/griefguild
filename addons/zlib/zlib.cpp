#include <zlib.h>
#include <v8.h>
#include <node.h>

using namespace v8;
using namespace node;

Handle<Value> inflate(const Arguments &args) {
	if (args.Length() != 1) {
		return ThrowException(Exception::TypeError(String::New("zlib.inflate expects a buffer")));
	}

	return Undefined();
}

Handle<Value> deflate(const Arguments &args) {
	if (args.Length() != 1) {
		return ThrowException(Exception::TypeError(String::New("zlib.inflate expects a buffer")));
	}

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
