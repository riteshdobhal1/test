#!/bin/bash

<<cut
Usage:   sh GBINSTALL_SET_PERM.sh -i <NEW/UPGRADE> -d <GB_INSTALL_DIR> -u <user>  -g <group> 
Example: sh GBINSTALL_SET_PERM.sh -i NEW -d /ephemeral/gb -u gbd  -g gbd
cut

. import_function


INSTYPE= #NEW 
GB_USER= #gbd
GB_GROUPNAME= #gbd
GB_DIR= #/ephemeral/gb

while getopts i:d:u:g opt
do
  case "$opt" in
    i) INSTYPE=$OPTARG;;
    d) GB_DIR=$OPTARG;;
    u) GB_USER=$OPTARG;;
    g) GB_GROUPNAME=$OPTARG;;
    \?) # unknown flag
        echo -e "${RED}Error: Unknown paramter in command !!!${END}" && exit 1;
  esac
done

if [ "$INSTYPE" != "NEW" -a "$INSTYPE" != "UPGRADE" ];then
	show_aws_syntax3 && exit 1;
fi

if [ ! -e $GB_DIR ];then
    echo "Error: Incorrect or non-existing Glassbeam directory" && show_aws_syntax3 && exit 1;
fi

#can add more checks to verify if user/group exist, instype is correct, etc

if [ "$INSTYPE" == "UPGRADE" ];then
	fprint "Setting the file permission (UPGRADE) ...."
	(chown -R $GB_USER:$GB_GROUPNAME $GB_DIR/tools/ &&
	chown -R $GB_USER:$GB_GROUPNAME /home/$GB_USER/.bashrc &&
	chmod -R 777 $GB_DIR/$GB_DB_USER/)
else
	fprint "Setting the file permission (NEW) ...."
	(chown -R $GB_USER:$GB_GROUPNAME $GB_DIR &&
	chown -R $GB_USER:$GB_GROUPNAME /home/$GB_USER/.bashrc &&
	chmod -R 777 $GB_DIR/$GB_DB_USER/
	chmod 777 $GB_DIR/$GB_DB_USER)
fi

echo "Done"
