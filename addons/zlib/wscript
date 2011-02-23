srcdir = '.'
blddir = 'build'
VERSION = '0.0.1'

def set_options(opt):
	opt.tool_options('compiler_cxx')

def configure(conf):
	conf.check_tool('compiler_cxx')
	conf.check_tool('node_addon')

	conf.env.append_value('LIBPATH_Z', '/usr/local/lib')
	conf.env.append_value('LIB_Z', 'z')
	conf.env.append_value('CPPPATH_Z', '/usr/local/include')

def build(bld):
	t = bld.new_task_gen('cxx', 'shlib', 'node_addon')
	t.target = 'zlib'
	t.source = 'zlib.cpp'
	t.uselib = 'Z'
