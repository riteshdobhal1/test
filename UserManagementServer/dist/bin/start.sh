#!/bin/bash

BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HOME_DIR="$(dirname "$BIN_DIR")"
CONF_DIR="${HOME_DIR}/conf"
LOG_DIR="${HOME_DIR}/logs"


CHECK="usermanagementserver"


STATUS=$(ps aux | grep -v grep | grep $CHECK)
# echo $STATUS
if [ "${#STATUS}" -gt 0 ]; 
then
  echo "`date`: UMS is already running";


else

  printf "Starting UMS..."


  nohup ./bin/usermanagementserver -Dconfig.file="${CONF_DIR}"/$app  -Dlogger.resource=$log -Dlog.path=$log_path  > /dev/null 2>&1  &
 
  ums_pid=$!

  echo "UMS Started with PID [$ums_pid] at [`date`]"

fi
