#!/bin/bash


CHECK="usermanagementserver"


PID=$(ps -ef | grep $CHECK | grep -v grep | awk '{print $2}')

 echo $PID

if [ -z $PID ]; then PID=`jps | grep usermanagementserver | awk '{print $1}'`; fi
COUNTER=0
if [ "${#PID}" -gt 0 ]
then
        kill $PID
        while [[ ( -d /proc/$PID ) && ( -z `grep zombie /proc/$PID/status` ) ]]
        do
        echo "`date`: Waiting for UMS to gracefully stop"
        sleep 10
        COUNTER=$(($COUNTER+1))
        if [ "$COUNTER" -gt 10 ]; then kill -9 $PID; break; fi
        done
        echo "`date`: UMS stopped"
else
        echo "`date`: UMS was not running"
fi

