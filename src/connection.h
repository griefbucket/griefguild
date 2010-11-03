#ifndef GUARD_GRIEF_CONNECTION
#define GUARD_GRIEF_CONNECTION

namespace grief {
	class IMessage;
}

#include "tcpconnection.h"

#include <string>
#include <zlib.h>

namespace grief {
	namespace impl {
		template <class T> class StreamMarshaller;
	}

	class Connection : private TCPConnection {
		char *buf;
		size_t bufSize;

		IMessage *msgBuf;

	public:
		Connection(const std::string& host, int port = 25565);
		virtual ~Connection();

		char *readBytes(size_t len);
		void writeBytes(void *buf, size_t len);

		template <class T>
		T read() {
			return impl::StreamMarshaller<T>::read(this);
		}

		template <class T>
		void write(T value) {
			impl::StreamMarshaller<T>::write(this, value);	
		}

		char *readCompressedBytes(size_t length);
	};

	namespace impl {
		template <class T>
		class FixEndian {
		public:
			inline static void fix(T &x) {}
		};

		template <>
		class FixEndian<short> {
		public:
			inline static void fix(short &x) {
				x = (x >> 8) |
					(x << 8);
			}
		};

		template <>
		class FixEndian<int> {
		public:
			inline static void fix(int &x) {
				x = (x >> 24) |
					((x << 8) & 0x00FF0000) |
					((x >> 8) & 0x0000FF00) |
					(x << 24);
			}
		};

		template <>
		class FixEndian<long> {
		public:
			inline static void fix(long &x) {
				x = (x >> 56) | 
					((x << 40) & 0x00FF000000000000) |
					((x << 24) & 0x0000FF0000000000) |
					((x << 8)  & 0x000000FF00000000) |
					((x >> 8)  & 0x00000000FF000000) |
					((x >> 24) & 0x0000000000FF0000) |
					((x >> 40) & 0x000000000000FF00) |
					(x << 56);
			}
		};

		template <class T>
		class StreamMarshaller {
		public:
			static T read(Connection* conn) {
				T value = *((T*) conn->readBytes(sizeof(T)));
				FixEndian<T>::fix(value);
				return value;
			}

			static void write(Connection* conn, T value) {
				FixEndian<T>::fix(value);
				return conn->writeBytes(&value, sizeof(T));
			}
		};

		template <>
		class StreamMarshaller<bool> {
		public:
			static bool read(Connection *conn) {
				return (bool) StreamMarshaller<char>::read(conn);
			}

			static void write(Connection *conn, bool value) {
				return StreamMarshaller<char>::write(conn, value ? 0x01 : 0x00);
			}
		};

		template <>
		class StreamMarshaller<std::string> {
		public:
			static std::string read(Connection *conn) {
				short len = StreamMarshaller<short>::read(conn);
				return std::string(conn->readBytes(len));
			}

			static void write(Connection *conn, const std::string &value) {
				StreamMarshaller<short>::write(conn, value.length());
				conn->writeBytes((void*) value.c_str(), value.length());
			}
		};
	}
}

#endif
