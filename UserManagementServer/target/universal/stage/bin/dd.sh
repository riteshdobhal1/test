#!/bin/bash



#Conf file
app="application-dd.conf"

#Log file
log="logger-prod.xml"

#Log_path
log_path=/home/deepa

echo "Starting Infoserver in AWS-gbp with Conf file = $app and Log file = $log and log directory=$log_path";

. ./bin/start.sh
