#!/bin/sh

. ./import_function
ENV=$1
ENV_ARR=(PROD POC QA DEV STAGE)
if [[ -z "$ENV" ]]
then
        show_all_config_syntax
        exit
elif ! [ -z "$ENV" ]
then
        if ! (printf '%s\n' "${ENV_ARR[@]}" | grep -xq $ENV); then
                show_all_config_syntax
                exit 1
        fi

fi
##### COPY TABLEAU FILES

fprint "Transferring latest Tableau files ...."
echo 
sh FTP_TABLEAU_FILES.sh
if [ $? -ne 0 ];then
    failed_status "Unable to transfer Tableau files"
fi
ok_status

#### UI CONFIGURATION 

fprint "Updating UI Configuration ...."
echo
sh UI_CONFIG.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update UI configurations"  
fi
ok_status

### INFOSERVER CONFIGURATION

fprint "Updating Infoserver Configuration ...."
echo
sh INFOSERVER_CONFIG.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update Infoserver configurations"
fi
ok_status

### UMS CONFIGURATION

fprint "Updating UMS Configuration ...."
echo
sh UMS_CONFIG.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update Ums configurations"
fi
ok_status

### APACHE CONFIGURATION

fprint "Updating Apache Configuration ...."
echo
sh APACHE_CONFIG.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update Apache configurations"
fi
ok_status

### UMS KEY SPACE CONFIGURATION

fprint "Updating UMS Keyspace Configuration ...."
echo
sh CASS_CONFIG_UMSKS.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update UMS Keyspace configurations"
fi
ok_status

### GLASSBEAM KEY SPACE CONFIGURATION

fprint "Updating GLASSBEAM Keyspace Configuration ...."
echo
sh CASS_CONFIG_GLASSBEAMKS.sh
if [ $? -ne 0 ];then
    failed_status "Unable to update Glassbeam Keyspace configurations"
fi
ok_status

echo "All configurations Complete!!!"
echo "Start/Restart Infoserver"
echo "Start/Restart User Management Server"
