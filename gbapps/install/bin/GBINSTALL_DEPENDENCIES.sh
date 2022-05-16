#!/bin/bash

. GLASSBEAM_ENV_PATHS.sh
. import_function

unset HOSTS_IP GB_DIR GBBACKUP LANG


export LD_LIBRARY_PATH=/usr/local/lib64:/usr/lib64:/lib64:/usr/local/lib:/usr/lib:/lib:/usr/local
export ODBCHOME=/usr/local
cwd=`pwd`


export PERL_MM_USE_DEFAULT=1
export TERM='xterm-256color'

ODBCINST='/usr/local/bin/odbcinst'
unixODBC=2.2.11
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


################################# gcc #################################################
#gcc

	fprint "Checking GCC installed"
	echo
	GCC=`gcc --version 2> /dev/null | cut -d' ' -f2 | $GREP '(GCC)'`
	if [ x$GCC == x ];then
        	        echo
                	echo "Trying to install the gcc from repo ..."
	                (yum -y --disableexcludes=main install kernel-headers && yum -y install gcc*)
        	        if [ $? -ne 0 ];then
                		process_fail 'gcc'
	                        failed_status "Unable to install gcc package."
                	else
                  	 	process_success "gcc"
                   		run=0
			fi
	else
		fprint "Found gcc installed"
	        process_success "gcc"
        	ok_status
	fi

################################# Aspell #################################################
#aspell

        fprint "Checking if aspell is installed"
        echo
        ASPELL_STATUS=`aspell --version 2> /dev/null | cut -d' ' -f2 | grep International`
        if [ x$ASPELL_STATUS == x ];then
                        echo
                        echo "Trying to install Asspell from repo ..."
                        yum install aspell -y
                        if [ $? -ne 0 ];then
                                process_fail 'aspell'
                                failed_status "Unable to install aspell package."
                        else
                                process_success "aspell"
                                run=0
                        fi
        else
                fprint "Found aspell installed"
                process_success "aspell"
                ok_status
        fi






################################# unix ODBC ###################################################
#installed unixODBC driver

odbcfound=
	if [ -e $ODBCINST ];then
	odbcfound=`$ODBCINST --version | cut -d" " -f2`
	fi
	if [ x$odbcfound == x ];then
		fprint "Installing unixODBC driver"
		ODBC=unixODBC-$unixODBC
		(cd ../unixODBC && tar -zxf $ODBC.tgz && cd $ODBC && ./configure --enable-gui=no && make && make install) > unixodbc.log 2>&1
		if [ $? -ne 0 ];then
			process_fail 'odbc'
			failed_status "Unable to install unixODBC version $ODBC"
		else
			if [ -e /etc/ld.so.conf ];then
				if [ `grep '/usr/local/lib' /etc/ld.so.conf | wc -l` -eq 0 ];then
					echo '/usr/local/lib' >> /etc/ld.so.conf
				fi
			fi
			/sbin/ldconfig
			process_success 'odbc'
			run=0
			ok_status
		fi
	else
		fprint "Found unixODBC $odbcfound installed"
		ok_status
	fi




################################# Expat Insttalation ###################################################


if [ `rpm -qa | grep expat-devel | wc -l` -eq 0 ];then
		fprint "Going to Installing expat-devel"
                (yum -y install expat-devel*)
		if [ $? -ne 0 ];then
			process_fail 'expat'
			failed_status "Installation Failed"
		else
			ok_status
			process_success 'expat'
			run=0
		fi
else
        fprint "Found Expat installed"
        ok_status
fi

###################### zlib-devel installation #############################

        fprint "Installing zlib ..."
        tar -zxf ../zlib/zlib-1.2.6.tar.gz -C ../zlib/ && cd ../zlib/zlib-1.2.6 && sh configure 1>>zlib_install_log && make 1>>zlib_install_log  && make install 1>>zlib_install_log && cd ../../bin
        if [ $? -ne 0 ];
        then
                failed_status "Error in Installing zlib-1.2.6"
                exit
        else
                ok_status
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

cp -f ../build_module/libdistcache.so.1 /usr/lib64/libdistcache.so.1
cp -f ../build_module/libdistcache.so.1.0.1 /usr/lib64/libdistcache.so.1.0.1
cp -f ../build_module/libnal.so.1 /usr/lib64/libnal.so.1 
cp -f ../build_module/libnal.so.1.0.1 /usr/lib64/libnal.so.1.0.1
cp -f ../build_module/libnal.so.1.0.1 /usr/lib64/libnal.so.1.0.1
cp -f ../build_module/libphp5.so $GB_DIR/tools/apache/modules/libphp5.so
cp -f ../build_module/mod_ssl.so $GB_DIR/tools/apache/modules/mod_ssl.so

if [ $? -ne 0 ];then
    echo "Failed to copy httpd config files. Please do manually."
fi


echo "Complete!!!"
