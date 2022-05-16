#!/bin/bash

####################### Imports and environment setup #####################
. GLASSBEAM_ENV_PATHS.sh
. import_function
export PERL_MM_USE_DEFAULT=1
export TERM='xterm-256color'

unset HOSTS_IP LANG
export LD_LIBRARY_PATH=/usr/local/lib64:/usr/lib64:/lib64:/usr/local/lib:/usr/lib:/lib:/usr/local
export ODBCHOME=/usr/local
cwd=`pwd`

B_GBOLD=F
GBVERSION=

#####################  VALIDATE INPUT ARGS ###################

while getopts i:d: opt
do
  case "$opt" in
    i) INSTYPE=$OPTARG;;
    d) BASEDIR=$OPTARG;;
    \?) # unknown flag
        echo -e "${RED}INCORRECT USAGE...!!!${END}" && show_aws_syntax; exit 1;;
  esac
done

#exit if install type is not NEW or UPGRADE
if [ "$INSTYPE" != "NEW" -a "$INSTYPE" != "UPGRADE" ];then
    echo -e "${RED}Invalid or missing INSTALL type parameter!!!${END}" && show_aws_syntax; exit 1;
fi

#exit if invalid BASE direcroty. GB_DIR is created by appending /gb to BASEDIR
#if [ "$BASEDIR" == "" ] || [ ! -e $BASEDIR ];then
if [ "$BASEDIR" == "" ];then
    echo -e "${RED}Error: Empty BASEDIR parameter!!!${END}" && show_aws_syntax; exit 1;
fi

#GB_DIR=$BASEDIR/gb/
GB_DIR=$BASEDIR


#GBBACKUP=$BASEDIR/gbbackup-$(date '+%Y%m%d%H%M%S')
GBBACKUP=/tmp/gbbackup-$(date '+%Y%m%d%H%M%S')

if [ ! -e $BASEDIR ];then
	echo "BASEDIR $BASEDIR doesn't exit. Trying to create.."
	mkdir -p $BASEDIR
	if [ $? -ne 0 ];then
    	    echo -e "${RED}Failed to create glassbeam directory: $GBDIR ${END}" && show_aws_syntax; exit 1;
	else
	    echo "Successfully created $BASEDIR"
	fi
fi



########################### Version information #######################
fprint "Going to install($INSTYPE) Glassbeam version: "
var=$(echo $cwd | gawk 'BEGIN { FS = "/" } {for ( i = 1; i <= NF; i = i + 1) print $i }')
for index in `echo $var`
do
        if [[ "$index" =~ "gb-release" ]];then
                GBVERSION=$(echo $index | awk -F"-" '{print $3}')
		echo $GBVERSION	
                break
        fi
done

echo "Using BASEDIR: $BASEDIR"


####################### GLASSBEAM DIRECTORIES SETTING ###################
#gb directories structure
DIR_LIST=(
$GB_DIR
$GB_DIR/tools
$GB_DIR/tools/apache/htdocs
$GB_DIR/tools/apache/build
$GB_DIR/tools/apache/build/libtool
$GB_DIR/build
$GB_DIR/tmp)

#backup earlier gb installations
#if [ $run -eq 0 ] && [ $rerun -eq 0 ];then
	if [ -e $GB_DIR ] && [ "$INSTYPE" == "NEW" ];then
        	#take backup earlier gb installtions
	        echo "Found Existence GB installed on path ($GB_DIR)"
	        fprint "Move to backup directory : $GBBACKUP"
	        (mv $GB_DIR "$GBBACKUP")
	        if [ $? -ne 0 ];then
        	        failed_status "Installation Failed"
	        else
        	        ok_status
	        fi
	else
		if [ "$INSTYPE" == "UPGRADE" ] && [ ! -e $GB_DIR ];then
			echo "No existence glassbeam installtion found ...,
		              Go with -i NEW for complete installation"
			      show_aws_syntax;
			      exit 1
		fi

		if [ "$INSTYPE" == "UPGRADE" ] && [ "$B_GBOLD" == "F" ];then
		mkdir -p "$GBBACKUP"
		#take the backup of current production script
		fprint "Taking backup of production code to $GBBACKUP"
		(mv "$GB_DIR/tools/apache/htdocs" "$GBBACKUP/htdocs") 
	        if [ $? -ne 0 ];then
                failed_status "Installation Failed"
       		else
                ok_status
                fi
		fi
	fi
	#Creating Directory structure
	if [ "$INSTYPE" == "NEW" ];then
	for element in $(seq 0 $((${#DIR_LIST[@]} - 1)))
	do
	    fprint "Creating Directory : ${DIR_LIST[element]}"
		(mkdir -p ${DIR_LIST[element]})
		if [ $? == 0 ];then 
		ok_status 
		else
		failed_status "Unable to creat the directory $element"
		fi
	done
	fi

	if [ "$INSTYPE" == "UPGRADE" ];then
	for element in $(seq 0 $((${#DIR_LIST[@]} - 1)))
        do
	    if [ ! -e "${DIR_LIST[element]}" ];then
            	    fprint "Creating Directory : ${DIR_LIST[element]}"
	            (mkdir -p ${DIR_LIST[element]})
        	    if [ $? == 0 ];then
	            ok_status
        	    else
	            failed_status "Unable to creat the directory $element"
        	    fi
	    fi
        done
	fi
	################################# copy the src files ###################################################

	if [ "$INSTYPE" == "NEW" ];then	

		fprint "Starting - copy the UI files"
		(cp -r ../../tools/* $GB_DIR/tools)
		if [ $? -ne 0 ];then
        	failed_status "UI SRC COPY Failed - UI"
		else
        	ok_status
		fi

		
	fi

	#production
        if [ "$INSTYPE" == "UPGRADE" ];then

                fprint "Starting - copy the UI files"
                
				(cp -r ../../tools/apache/htdocs $GB_DIR/tools/apache)
                if [ $? -ne 0 ];then
                failed_status "UI SRC COPY Failed - UI"
                else
                ok_status
                fi

        fi

#fi


if [ "$INSTYPE" == "NEW" ];
then
    cp -r html-compressor/ $GB_DIR
fi


################## Create soft link  /glassbeam for GBDIR ####################
if [ ! -e /glassbeam ];then
    ln -s $GB_DIR /glassbeam
else
   rm -rf /glassbeam
   ln -s $GB_DIR /glassbeam
fi

echo
echo -e "${GREEN}Installation complete!!! ${END}"

if [ "$INSTYPE" == "NEW" ];then
    echo "Now run the script GBINSTALL_DEPENDENCIES.sh to install dependencies"
else
    echo "Now run the script GBINSTALL_SET_PERM.sh to CHANGE permission of '$GB_DIR' for a particular user"
fi
