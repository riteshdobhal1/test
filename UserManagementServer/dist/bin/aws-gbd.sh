#!/bin/bash

#AWS-gbd

#Conf file
app="application-gbd.conf"

#Log file
log="logger.xml"

#Log_path
log_path=/home/gbd/is/current

echo "Starting UMS in AWS-gbp with Conf file = $app and Log file = $log and log directory=$log_path";

. ./bin/start.sh
