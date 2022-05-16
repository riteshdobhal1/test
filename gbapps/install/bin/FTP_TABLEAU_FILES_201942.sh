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
        else
             if [ -e "server_dtls_${ENV}" ]
             then
                . "./server_dtls_${ENV}"
             else
                failed_status "Server Details configuration file missing for $ENV environment"
                exit 1
             fi
        fi

fi
LOGFILE=ftplog 
ERR_MSG1='Not connected'
ERR_MSG2='Login or password incorrect'
ERR_MSG3='directory not found'

if [ ! -d $LOCALDIR_CSS_201942 ]
then
   failed_status "Local Directory $LOCALDIR_CSS_201942 does not exist"
   exit 1
elif [ ! -d $LOCALDIR_HTML_201942 ]
then
   failed_status "Local Directory $LOCALDIR_HTML_201942 does not exist"
   exit 1 
elif [ ! -d $LOCALDIR_JAVASCRIPT_201942 ]
then
   failed_status "Local Directory $LOCALDIR_JAVASCRIPT_201942 does not exist"
   exit 1
fi

ftp -n -d $TABLEAU_HOST > $LOGFILE <<END_SCRIPT
quote USER $TABLEAU_USER
quote PASS $TABLEAU_PASSWORD
END_SCRIPT

grep -i "$ERR_MSG2" $LOGFILE &> /dev/null
if [ $? -eq 0 ]; then failed_status "Login credentials not valid to connect to Tableau Server" ; exit 1 ; fi

grep -i "$ERR_MSG1" $LOGFILE &> /dev/null
if [ $? -eq 0 ]; then failed_status "Unable to connect to Tableau Server" ; exit 1 ; fi


ftp -n -d $TABLEAU_HOST > $LOGFILE <<END_SCRIPT
quote USER $TABLEAU_USER
quote PASS $TABLEAU_PASSWORD
cd $REMOTEDIR_HTML_201942
prompt
bin
lcd $LOCALDIR_HTML_201942 
mput *.*
END_SCRIPT

grep -i "$ERR_MSG3" $LOGFILE &> /dev/null
if [ $? -eq 0 ]; then failed_status "Remote Directory $REMOTEDIR_HTML_201942 not found on Tableau Server, file transfer failed" ; exit 1 ; fi

gzip < $LOCALDIR_JAVASCRIPT_201942/vqlweb.js > $LOCALDIR_JAVASCRIPT_201942/vqlweb.js.gz 
brotli < $LOCALDIR_JAVASCRIPT_201942/vqlweb.js > $LOCALDIR_JAVASCRIPT_201942/vqlweb.js.br

ftp -n -d $TABLEAU_HOST > $LOGFILE <<END_SCRIPT
quote USER $TABLEAU_USER
quote PASS $TABLEAU_PASSWORD
cd $REMOTEDIR_JAVASCRIPT_201942
prompt
bin
lcd $LOCALDIR_JAVASCRIPT_201942
mput *.*
quit
END_SCRIPT

grep -i "$ERR_MSG3" $LOGFILE &> /dev/null
if [ $? -eq 0 ]; then failed_status "Remote Directory $REMOTEDIR_JAVASCRIPT_201942 not found on Tableau Server, file transfer failed" ; exit 1 ; fi

ftp -n -d $TABLEAU_HOST > $LOGFILE <<END_SCRIPT
quote USER $TABLEAU_USER
quote PASS $TABLEAU_PASSWORD
cd $REMOTEDIR_CSS_201942
prompt
bin
lcd $LOCALDIR_CSS_201942
mput *.*
quit
END_SCRIPT

grep -i "$ERR_MSG3" $LOGFILE &> /dev/null
if [ $? -eq 0 ]; then failed_status "Remote Directory $REMOTEDIR_CSS_201942 not found on Tableau Server, file transfer failed" ; exit 1 ; fi

ok_status 
