#!/bin/bash

CHECK="usermanagementserver"
STATUS=$(ps aux | grep -v grep | grep $CHECK)
# echo $STATUS 
if [ "${#STATUS}" -gt 0 ] ;
then echo "`date`: UMS is running"
else echo "`date`: UMS is not running"
fi
