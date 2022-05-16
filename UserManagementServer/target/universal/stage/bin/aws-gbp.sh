#!/bin/bash



#Conf file
app="application-gbp.conf"

#Log file
log="logger.xml"

#Log_path
log_path=/home/gbp/is/current

echo "Starting ums in AWS-gbp with Conf file = $app and Log file = $log and log directory=$log_path";

. ./bin/start.sh
