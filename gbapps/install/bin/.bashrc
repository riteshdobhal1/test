# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific aliases and functions
#export PGDATA=/icecube/pg_data
export GB_FPATH=/glassbeam/2.3/gb_fpath
export EDITOR=/usr/bin/vim
export PATH=/glassbeam/2.3/tools/pgsql/bin:/glassbeam/2.3/tools/apache/bin:/glassbeam/2.3/tools/bin:/usr/local/bin:/usr/bin:/usr/X11R6/bin:/bin:/usr/sbin:/sbin:/usr/games:/opt/gnome/bin:/opt/kde3/bin:/usr/lib/mit/bin:/usr/lib/mit/sbin:/glassbeam/2.3/core/bin/ba
export LIB=/glassbeam/2.3/tools/pgsql/lib:/glassbeam/2.3/tools/apache/lib:/glassbeam/2.3/tools/lib64:/glassbeam/2.3/tools/lib:/usr/X11R6/lib64:/usr/local/lib64:/usr/lib64:/lib64:/usr/X11R6/lib:/usr/local/lib:/usr/lib:/lib
export LDFLAGS='-L/glassbeam/2.3/tools/pgsql/lib -L/glassbeam/2.3/tools/apache/lib -L/glassbeam/2.3/tools/lib64 -L/glassbeam/2.3/tools/lib -L/usr/X11R6/lib64 -L/usr/local/lib64 -L/usr/lib64 -L/lib64 -L/usr/X11R6/lib -L/usr/local/lib -L/usr/lib -L/lib'
export LDDLFLAGS='-shared '$LDFLAGS
export LD_LIBRARY_PATH=$LIB
export TERM=xterm-color
export CFLAGS=-O3
export CPPFLAGS='-fPIC -I/glassbeam/2.3/tools/pgsql/include -I/glassbeam/2.3/tools/include/gnome -I/glassbeam/2.3/tools/include/gsl -I/glassbeam/2.3/tools/include/libgtop-2.0 -I/glassbeam/2.2/tools/include/neon -I/glassbeam/2.3/tools/apache/include -I/glassbeam/2.3/tools/include/openssl -I/glassbeam/2.3/tools/include -I/usr/X11R6/include -I/usr/local/include -I/usr/include'
export PATH=$PATH:/glassbeam/2.3/core/bin
export SA_PATH=/glassbeam/2.3/core


