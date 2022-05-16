#!/bin/bash

#. GLASSBEAM_ENV_PATHS.sh
#. import_function

#unset HOSTS_IP GB_DIR GBBACKUP LANG


#export LD_LIBRARY_PATH=/usr/local/lib64:/usr/lib64:/lib64:/usr/local/lib:/usr/lib:/lib:/usr/local
#export ODBCHOME=/usr/local
#cwd=`pwd`


export PERL_MM_USE_DEFAULT=1
export TERM='xterm-256color'

#ODBCINST='/usr/local/bin/odbcinst'
#unixODBC=2.2.11
GREP='/bin/grep'
IFCONFIG='/sbin/ifconfig'


#GB_DIR=/db_catalog/other/gb/

while getopts d: opt
do
  case "$opt" in
    d) GB_DIR=$OPTARG;;
    \?) # unknown flag
        echo -e "${RED}Error: Unknown paramter in command !!!${END}" && show_aws_syntax2 && exit 1;
  esac
done

if [ "$GB_DIR" == "" ] || [ ! -e $GB_DIR ];then
    echo -e "${RED}Error: Invalid or non-existing Glassbeam directory provided as input. Please provide correct Glassbeam installation path. ${END}" && show_aws_syntax2 && exit 1;
fi


################################# Build package installation ###################################################
#install the build module
echo "Going to Installing Build package"

#if [ $run -eq 0 ];then
	(export PATH=$PATH:$cwd &&
	cd ../build_module && 
	cp *.* $GB_DIR/build && 
	cd $GB_DIR/build && 
	tar -zxf *.tar.gz)
#fi

BUILD_LISTS=( httpd-2.2.31)

for name in ${BUILD_LISTS[@]}
do
	fprint "Installing build package $name"
	(cd ${GB_DIR}/build/${name} && chmod -R 755 ./* && sh ./RUNTHIS.sh 1> $cwd/build_$(date '+%Y%m%d').log 2>&1)
		if [ $? -ne 0 ];then
        		process_fail $name 
		        failed_status "Installation Failed"
		else
        		process_success $name 
		        ok_status && /sbin/ldconfig
			run=0

		fi
done


############## Copy httpd config files #####################################

fprint "Copying config files to $GB_DIR/tools/apache/conf/"
cp -f ../build_module/httpd.conf $GB_DIR/tools/apache/conf/httpd.conf
cp -f ../build_module/httpd-ssl.conf $GB_DIR/tools/apache/conf/extra/httpd-ssl.conf
cp -f ../build_module/gd_bundle.crt /glassbeam/tools/apache/conf/
cp -f ../build_module/glassbeam.com.crt /glassbeam/tools/apache/conf/
cp -f ../build_module/glassbeam.com.key /glassbeam/tools/apache/conf/
cp -f ../build_module/httpd-maintenance.conf $GB_DIR/tools/apache/conf/httpd-maintenance.conf
cp -f ../build_module/README-maintenance.txt $GB_DIR/tools/apache/conf/README-maintenance.txt

cp -f ../build_module/libdistcache.so.1 /usr/lib/libdistcache.so.1
cp -f ../build_module/libdistcache.so.1.0.1 /usr/lib/libdistcache.so.1.0.1
cp -f ../build_module/libnal.so.1 /usr/lib/libnal.so.1 
cp -f ../build_module/libnal.so.1.0.1 /usr/lib/libnal.so.1.0.1
cp -f ../build_module/libnal.so.1.0.1 /usr/lib/libnal.so.1.0.1
cp -f ../build_module/libphp5.so $GB_DIR/tools/apache/modules/libphp5.so
cp -f ../build_module/mod_ssl.so $GB_DIR/tools/apache/modules/mod_ssl.so

if [ $? -ne 0 ];then
    echo "Failed to copy httpd config files. Please do manually."
fi


echo "Complete!!!"
