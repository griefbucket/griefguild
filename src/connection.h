#ifndef GUARD_GRIEF_CONNECTION
#define GUARD_GRIEF_CONNECTION

#include "tcpconnection.h"
#include "messages.h"

#include <string>

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
	};

	namespace impl {
		template <class T>
		class StreamMarshaller {
		public:
			static T read(Connection* conn) {
				return *((T*) conn->readBytes(sizeof(T)));
			}

			static void write(Connection* conn, T value) {
				return conn->writeBytes(&value, sizeof(T));
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
