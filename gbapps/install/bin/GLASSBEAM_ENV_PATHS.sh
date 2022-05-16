# User specific aliases and functions
#echo 'setting GB-FPATH'
export ODBCHOME='/usr/local/'
#echo 'setting EDITOR'
export EDITOR=/usr/bin/vim
#echo 'setting PATH'
export PATH=.:/usr/java/jdk1.7.0_21/bin:/home/gbprod/gbsoft/apache-maven-3.0.4/bin:/home/gbprod/gbsoft/groovy-2.0.5/bin:/glassbeam/tools/pgsql/bin:/glassbeam/tools/apache/bin:/glassbeam/tools/bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/X11R6/bin:/bin:/usr/sbin:/sbin:/usr/games:/opt/gnome/bin:/opt/kde3/bin:/usr/lib/mit/bin:/usr/lib/mit/sbin
#echo 'setting LIB'
export LIB=.:/glassbeam/tools/pgsql/lib:/glassbeam/tools/apache/lib:/glassbeam/tools/lib64:/glassbeam/tools/lib:/usr/X11R6/lib64:/usr/local/lib64:/usr/lib64:/lib64:/usr/X11R6/lib:/usr/local/lib:/usr/lib:/lib:/usr/lib64/httpd:/usr/local:/usr/local/lib
#echo 'setting LDFLAGS'
export LDFLAGS='-L/glassbeam/tools/pgsql/lib -L/glassbeam/tools/apache/lib -L/glassbeam/tools/lib64 -L/glassbeam/tools/lib -L/usr/X11R6/lib64 -L/usr/local/lib64 -L/usr/lib64 -L/lib64 -L/usr/X11R6/lib -L/usr/local/lib -L/usr/lib -L/lib'
#echo 'setting LDDFLAGS'
export LDDLFLAGS='-shared '$LDFLAGS
#echo 'setting LD_LIBRARY_PATH'
export LD_LIBRARY_PATH=$LIB
#echo 'setting TERM'
export TERM=xterm-color
#echo 'setting CFLAGS'
export CFLAGS=-O3
#echo 'setting CPPLAGS'
export CPPFLAGS='-fPIC -I/glassbeam/tools/pgsql/include -I/glassbeam/tools/include/gnome -I/glassbeam/tools/include/gsl -I/glassbeam/tools/include/libgtop-2.0 -I/glassbeam/tools/include/neon -I/glassbeam/tools/apache/include -I/glassbeam/tools/include/openssl -I/glassbeam/tools/include -I/usr/X11R6/include -I/usr/local/include -I/usr/include'
#echo 'setting SA_PATH AND DB_ADMIN'
export JAVA_HOME=/usr/java/jdk1.7.0_21
export GROOVY_HOME=/home/gbprod/gbsoft/groovy-2.0.5
export MAVEN_OPTS='-Xms512m -Xmx3072m'

